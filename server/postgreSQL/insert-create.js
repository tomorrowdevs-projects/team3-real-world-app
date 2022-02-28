const { prisma } = require('./prisma-client');
const csv = require('@fast-csv/parse');

const smallFile = "../../big-faker-creation/csv2upload/fake_data_stream.csv";
const bigFile = "../csv/fake_data_stream.csv";

const start = Date.now();



async function readCSVwriteData() {
    console.log(new Date().toLocaleString());

    csv.parseFile(bigFile, {
        headers: true,
        delimiter: ";",
        //skipRows: i,
        maxRows: 10000

    })
    .on("data", async (data) => {  

        await insertData(data);
        console.log('insert')

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
    //.catch((err) => {throw err})
}

readCSVwriteData()
