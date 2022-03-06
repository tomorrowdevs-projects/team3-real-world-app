const {
    prisma, prismaError
} = require('./prisma-client');
const {
    parse
} = require('fast-csv');
const path = require('path');
const fs = require('fs');
const {
    Stream
} = require('stream');
const Promise = require("bluebird")

const smallFile = "../big-faker-creation/csv2upload/fake_data_stream.csv";
const bigFile = path.join(__dirname, "./csv/fake_data_stream.csv");

const start = Date.now();
let rows = []
let counter = 0

function readCSVwriteData() {
    console.log(new Date().toLocaleString());

    const stream = fs.createReadStream(bigFile)
        .pipe(parse({
            headers: true,
            delimiter: ";",
            //skipRows: i,
            // maxRows: 10000
        }))
        .on("data", async (data) => {
            counter++
            rows.push(data)
            if (counter == 1000) {
                stream.pause()
                await Promise.map(rows, async (row) => {
                    await insertData(row).catch((e) => {
                        if (e instanceof prismaError) {
                            if (e.code === 'P2002') {
                              console.log(
                                `There is a unique constraint violation, user or product can't be duplicated`
                              )
                            }
                        } else {
                            console.error
                        }
                    }), {
                    concurrency: 50
                    }
                })
                rows = []
                counter = 0
                stream.resume()
            }
        })
        .on("end", () => {
            console.log("Data transacted!");
            console.log(new Date().toLocaleString());

        })
        .on("error", (err) => {
            console.log(err);
        })
}


async function insertData(record) {

    await prisma.order.create({
        data: {
            orderDate: new Date(),
            externalId: record["Order ID"],
            quantity: parseInt(record["Quantity"]),
            price: parseFloat(record["Price"]),
            user: {
                connectOrCreate: {
                    where: {
                        email: record["Email"]
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
                        username: record["Username"]
                    },
                },
            },
            product: {
                connectOrCreate: {
                    where: {
                        name: record["Product"]
                    },
                    create: {
                        name: record["Product"],
                        productType: record["Type"],
                        color: record["Color"],
                        description: record["Description"]
                    },
                },
            }
        }
    })
}

readCSVwriteData()