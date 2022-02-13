const { PrismaClient } = require('@prisma/client');
const csv = require('@fast-csv/parse');

const prisma = new PrismaClient();

let invalidInserts = [] // an array where data of a failed insert will be populated 
var counter = 1  // this is the counter of csv row number we will be reading

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
        const query_product = await prisma.$queryRaw`INSERT INTO "Product" ("name", "productType", "color", "description") VALUES (${record["Product"]}, ${record["Type"]}, ${record["Color"]}, ${record["Description"]});`         
        const query_user = await prisma.$queryRaw`INSERT INTO "User" ("firstname", "lastname", "username", "email", "phone", "address", "zip", "city", "country") VALUES (${record["First Name"]}, ${record["Last Name"]}, ${record["Username"]}, ${record["Email"]}, ${record["Phone"]}, ${record["Address"]}, ${record["Zip"]}, ${record["City"]}, ${record["Country"]});`         
        const query_order = await prisma.$queryRaw`INSERT INTO "Order" ("externalId", "orderDate", "userId", "productId", "price", "quantity") VALUES (${record["Order ID"]}, NOW(), (SELECT MAX("id") FROM "User"), (SELECT MAX("id") FROM "Product"), ${parseFloat(record["Price"])}, ${parseInt(record["Quantity"])});`         
    } catch (e) {
        console.log("Insert Function Error:")
        console.log(e)
        // in the following line we insert the row number and the record that generated the error inside the invalidInserts array
        invalidInserts.push(counter, record)
    }

}

readCSVwriteData()