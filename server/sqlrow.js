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


async function generateInsertBulkQuery (total_data) {

    let query = "";

    for (let i = 0; i < total_data.length; i++) {query = query +
    `INSERT INTO public."User"(
        "updatedAt", firstname, lastname, username, email, phone, address, zip, city, country)
        VALUES (CURRENT_DATE, 'Federico', 'Siddi', 'team3', 'prova@email.it', '+39 3291119995', 'via le mani dal naso', 95125, 'Milano', 'Italy');
    
    INSERT INTO public."Product"(
        name, color, description, "productType", "updatedAt")
        VALUES ('Nike Air', 'orange', 'bests Nike shoes ever made', 'shoes', CURRENT_DATE);
    
    INSERT INTO public."Order"(
        "externalId", "userId", "productId", price, "orderDate", quantity, "updatedAt")
        VALUES ('5', (select max(id) from public."User"), (select max(id) from public."Product"), 5.99, '2022-01-31T22:53:30.333', 99, CURRENT_DATE);\n\n`
    }

    return query

}


async function writeCSV(data2write) {

    const query = await generateInsertBulkQuery(data2write);
    await prisma.$transaction([prisma.$executeRaw`
    INSERT INTO public."User"(
        "updatedAt", firstname, lastname, username, email, phone, address, zip, city, country)
        VALUES (CURRENT_DATE, 'Federico', 'Siddi', 'team3', 'prova@email.it', '+39 3291119995', 'via le mani dal naso', 95125, 'Milano', 'Italy');`])
    
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
    })
    //console.log('Order inserted successfully by CSV');

}

async function loopCSV(file) {    
    const total_data = await getData(file);
    write_chunck(0)

    function write_chunck(n) {
        for (let i = n; i < n + 10; i++) {
            writeCSV(total_data[i]);
        }
    }
}
