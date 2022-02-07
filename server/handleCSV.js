const { PrismaClient, Prisma } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();
const csvFile = './csv/fake_data_stream.csv';

loopCSV(csvFile);

function getData(file) {
    const data = fs.readFileSync(file, 'utf8', (err, content) => {
        if (err) {
            console.error(err);
            return
        }
        return content;
    });
    const table = data.split('\n');
    const rows = new Array();
    table.forEach((row) => {
        const column = row.split(';');
        rows.push(column);
    });
    return rows;
}


async function writeCSV(data2write) {

    await prisma.order.create({
        data: {
            //orderDate: new Date(data2write[9]),
            orderDate: new Date('2022-02-06T22:53:30.333'),
            externalId: data2write[10],
            quantity: parseInt(data2write[11]),
            price: parseFloat(data2write[16]),
            user: {
                create: {
                    firstname: data2write[0],
                    lastname: data2write[1],
                    email: data2write[2],
                    address: data2write[3],
                    zip: parseInt(data2write[4]),
                    city: data2write[5],
                    country: data2write[6],
                    phone: data2write[7],
                    username: data2write[8],
                },
            },
            product: {
                create: {
                    name: data2write[12],
                    productType: data2write[13],
                    color: data2write[14],
                    description: data2write[15]
                },
            },
        }
    })
    .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2000') {
                console.log('A column is too long\n', `meta: ${e.meta.target}\n`, `column: ${e.meta.column}\n`)
            } else {
                console.error(e)
            }
          }
        throw e
    })
    .finally(async () => {
      await prisma.$disconnect()
    });
    console.log('Order inserted successfully by CSV');
}

async function loopCSV(file) {
    const data = await getData(file);
    for (row of data) {
        writeCSV(row);
    }
}

module.exports = {
    writeCSV
}