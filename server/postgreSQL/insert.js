const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insert() {
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
    .catch((e) => {
      throw e
    })
    .finally(async () => {
      await prisma.$disconnect()
    });
    console.log('Order inserted successfully');
}



module.exports = {
insert
}