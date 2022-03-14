const { prisma, Prisma } = require("../prisma-client");
const { parse } = require("fast-csv");
const path = require("path");
const fs = require("fs");
const { Stream } = require("stream");
const Promise = require("bluebird");
const prismaError = Prisma.PrismaClientKnownRequestError;


const smallFile = path.join(__dirname, "../../big-faker-creation/csv2upload/fake_data_stream.csv");
const bigFile = path.join(__dirname, "./csv/fake_data_stream.csv");


let rows = [];
let counter = 0;
let arrayErrors = [];

function readCSVwriteData(filePath) {
  console.log(new Date().toLocaleString());

  const stream = fs
    .createReadStream(filePath)
    .pipe(
      parse({
        headers: true,
        delimiter: ";",
        //skipRows: i,
        // maxRows: 10000
      })
    )
    .on("data", (data) => {
      counter++;
      rows.push(data);
      if (counter == 1000) {
        stream.pause();
        Promise.map(
          rows,
          async (row) => {
            await insertData(row).catch((e) => {
              if (e.code === "P2002" || e.code === "P1001") {
                arrayErrors.push(row);
              } else {
                console.error;
              }
            });
          },
          {
            concurrency: 10,
          }
        ).then(() => {
          rows = arrayErrors;
          arrayErrors = [];
          counter = 0;
          stream.resume();
        });
      }
    })
    .on("end", () => {
      if (rows.length > 0) {
        Promise.map(
          rows,
          async (row) => {
            await insertData(row).catch((e) => {
              if (e.code === "P2002" || e.code === "P1001") {
                arrayErrors.push(row);
              } else {
                console.error;
              }
            });
          },
          {
            concurrency: 10,
          }
        ).then(() => {
          if (arrayErrors.length > 0) {
            Promise.map(
              arrayErrors,
              async (row) => {
                await insertData(row).catch((e) => {
                  console.log("last errors");
                  console.log(row);
                });
              },
              {
                concurrency: 10,
              }
            );
          }
        });
      }
      console.log("Data written!");
      console.log(new Date().toLocaleString());
    })
    .on("error", (err) => {
      console.log(err);
    });
}

async function insertData(record) {
  await prisma.order.create({
    data: {
      orderDate: new Date(record["Order Date"]),
      externalId: record["Order ID"],
      quantity: parseInt(record["Quantity"]),
      price: parseFloat(record["Price"]),
      user: {
        connectOrCreate: {
          where: {
            email: record["Email"],
          },
          create: {
            firstname: record["First Name"],
            lastname: record["Last Name"],
            email: record["Email"],
            address: record["Address"],
            zip: record["Zip"],
            city: record["City"],
            country: record["Country"],
            phone: record["Phone"],
            username: record["Username"],
          },
        },
      },
      product: {
        connectOrCreate: {
          where: {
            name: record["Product"],
          },
          create: {
            name: record["Product"],
            productType: record["Type"],
            color: record["Color"],
            description: record["Description"],
          },
        },
      },
    },
  });
}

module.exports = {
  readCSVwriteData,
};

//readCSVwriteData(smallFile)