const express = require("express");
const app = express();
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


async function queryAll() {
    const allOrders = await prisma.order.findMany({
        include: {
            user: true,
            product: true,
        },
    });
    // console.dir(allOrders, {
    //     depth: null
    // });
    return allOrders
}

async function insertData() {
    await prisma.order.create({
        data: {
            orderDate: new Date('2022-01-31T22:53:30.333'),
            externalId: '5',
            quantity: 99,
            price: 5.99,
            user: {
                create: {
                    firstname: 'Federico',
                    lastname: 'Siddi',
                    email: 'prova@email.it',
                    address: 'via le mani dal naso',
                    zip: 95125,
                    city: 'Milano',
                    country: 'Italy',
                    phone: '+39 3291119995',
                    username: 'team3'
                },
            },
            product: {
                create: {
                    name: 'Nike Air',
                    productType: 'shoes',
                    color: 'orange',
                    description: 'bests Nike shoes ever made'
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
    
    res.json(insertData()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    }))
})

app.listen(5000)