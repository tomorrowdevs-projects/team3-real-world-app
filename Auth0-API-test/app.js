const express = require("express");
const app = express();
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const csv = require('@fast-csv/parse');

let invalidInserts = [] // an array where data of a failed insert will be populated 
var counter = 1  // this is the counter of csv row number we will be reading

async function readCSVwriteData() { // function used to parse the csv file and write in the db
    console.log(new Date().toLocaleString());

    // let header = [];
    // let data = [];
    let csvStream = await csv.parseFile(".\\csv\\fake_data_stream_copy.csv", {
            headers: true,
            delimiter: ";"
        })
        .on("data", async (record) => {
            csvStream.pause();
            ++counter;
            await insertData(record)
            csvStream.resume();

        }).on("end", () => {
            console.log(invalidInserts)
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
                orderDate: new Date(record.orderDate),
                externalId: record.orderId,
                quantity: parseInt(record.orderQuantity),
                price: parseFloat(record.orderPrice),
                user: {
                    create: {
                        firstname: record.firstName,
                        lastname: record.lastName,
                        email: record.email,
                        address: record.address,
                        zip: parseInt(record.zipCode),
                        city: record.city,
                        country: record.country,
                        phone: record.phone,
                        username: record.userName
                    },
                },
                product: {
                    create: {
                        name: record.productName,
                        productType: record.productType,
                        color: record.productColor,
                        description: record.productDescr
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

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-b776ij9u.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'http://localhost:5000',
    issuer: 'https://dev-b776ij9u.us.auth0.com/',
    algorithms: ['RS256']
});


app.get("/public", (req, res) => {
    res.json({
        type: "public"
    })
})

app.get("/queryAll", jwtCheck, async (req, res) => {
    const query = await queryAll()
        .catch((e) => {
            throw e
        })
        .finally(async () => {
            await prisma.$disconnect()
        })
    res.json(query)
})

app.get("/insert", jwtCheck, (req, res) => {

    readCSVwriteData()
        .catch((e) => {
            throw e
        })
        .finally(async () => {
            await prisma.$disconnect()
        })
})

app.listen(5000)