const express = require("express");
const app = express();
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const csv = require('@fast-csv/parse');

async function readCSVwriteData(){
    let counter = 0; 

// let header = [];
// let data = [];
let csvStream = await csv.parseFile(".\\csv\\fake_data_stream.csv", { headers: true, delimiter: ";" })
    .on("data", function(record){
        csvStream.pause();
        if (counter < 1000) {
            insertData(record)
            ++counter;
        }

        csvStream.resume();

    }).on("end", function(){
        console.log("Job is done!");
    }).on("error", function(err){
        console.log(err);
    });
}


async function queryAll() {
    const allOrders = await prisma.order.findMany({
        include: {
            user: true,
            product: true,
        },
    });
    return allOrders
}

async function insertData(record) {
    await prisma.order.create({
        data: {
        orderDate: new Date('2022-01-31T22:53:30.333'),
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