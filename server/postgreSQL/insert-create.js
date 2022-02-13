const jwks = require('jwks-rsa');
const { PrismaClient } = require('@prisma/client');
const csv = require('@fast-csv/parse');

const prisma = new PrismaClient();

let invalidInserts = [] // an array where data of a failed insert will be populated 
var counter = 1  // this is the counter of csv row number we will be reading


const start = Date.now();

async function readCSVwriteData() { // function used to parse the csv file and write in the db
    console.log(new Date().toLocaleString());

    // let header = [];
    // let data = [];

    let csvStream = await csv.parseFile("../../big-faker-creation/csv2upload/fake_data_stream.csv", {
            headers: true,
            delimiter: ";"
        })
        .on("data", async (record) => {
            csvStream.pause();
            ++counter;
            await insertData(record)
            csvStream.resume();

        }).on("end", () => {
            //console.log(invalidInserts)
            console.log("Job is done!");
            console.log(new Date().toLocaleString());
              
        }).on("error", (err) => {
            console.log(err);
        });
}


async function queryAll() { // function used to query all the data in the db
    const allOrders = await prisma.order.findMany({
        include: {
            user: true,
            product: true,
        },
    });
    return allOrders
}

async function insertData(record) { // function used to insert csv row data in the db
    try {
        await prisma.order.create({
            data: {
                orderDate: new Date(record["Order Date"]),
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
    } catch (e) {
        console.log("Insert Function Error:")
        console.log(e)
        // in the following line we insert the row number and the record that generated the error inside the invalidInserts array
        invalidInserts.push(counter, record)
    }

}

readCSVwriteData()
