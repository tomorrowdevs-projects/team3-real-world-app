const { prisma } = require('./prisma-client');
const csv = require('@fast-csv/parse');
const path = require('path');
const fs = require('fs');

const smallFile = "../../big-faker-creation/csv2upload/fake_data_stream.csv";
const bigFile = path.join(__dirname, "../csv/fake_data_stream.csv");

const start = Date.now();

async function readCSVwriteData() {
    console.log(new Date().toLocaleString());

    fs.createReadStream(bigFile, {
        headers: true,
        delimiter: ";",
        //skipRows: i,
        maxRows: 10000
    })
        .pipe(csv.parse())
        .on("data", (data) => {

            insertData(data)
                .then(() => console.log(`Insert`))
                .catch(console.error)

        })
        .on("end", () => {
            console.log("Data transacted!");
            console.log(new Date().toLocaleString());

        })
        .on("error", (err) => {
            console.log(err);
        })
}


function insertData(record) {
    return prisma.order.create({
        data: {
            orderDate: new Date(),
            externalId: record["Order ID"],
            quantity: parseInt(record["Quantity"]),
            price: parseFloat(record["Price"]),
            user: {
                create: {
                    firstname: record["First Name"],
                    lastname: record["Last Name"],
                    email: record["Email"],
                    address: record["Address"],
                    zip: record["Zip"],
                    city: record["City"],
                    country: record["Country"],
                    phone: record["Phone"],
                    username: record["Username"]
                },
            },
            product: {
                create: {
                    name: record["Product"],
                    productType: record["Type"],
                    color: record["Color"],
                    description: record["Description"]
                },
            },
        }
    })
}

readCSVwriteData()
