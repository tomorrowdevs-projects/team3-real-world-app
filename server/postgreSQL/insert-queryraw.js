const { PrismaClient } = require('@prisma/client');
const csv = require('@fast-csv/parse');

const prisma = new PrismaClient();

let invalidInserts = [] // an array where data of a failed insert will be populated 
//var counter = 1  // this is the counter of csv row number we will be reading

function readCSVwriteData() { // function used to parse the csv file and write in the db
    console.log(new Date().toLocaleString());
    // ../../big-faker-creation/csv2upload/fake_data_stream.csv
    for (let i = 0; i < 100000; i += 1001){
        csv.parseFile("../csv/fake_data_stream.csv", {
                headers: true,
                delimiter: ";",
                skipRows: i,
                maxRows: (i + 1000)
            })
            .on("data", (row) => {
                insertData(row)
            }).on("error", (err) => {
                console.log(err);
            });
        }
}


async function insertData(record) { // function used to insert csv row data in the db
    try {
        // check if the product exists 
        async function checkProduct(record){
            const exists_product = await prisma.$queryRaw`SELECT EXISTS(SELECT id FROM "Product" WHERE "name" = ${record["Product"]});`
            if (exists_product[0].exists == true){
                // if product exists extract the id to be insert into the new order query
                const product_id_query = await prisma.$queryRaw`SELECT id FROM "Product" WHERE "name" = ${record["Product"]};` 
                return product_id_query[0].id
            }
            else{
                // if not exists, insert new product into the DB and extract the id to be insert into the new order query
                const product_insert_query = await prisma.$queryRaw`INSERT INTO "Product" ("name", "productType", "color", "description") VALUES (${record["Product"]}, ${record["Type"]}, ${record["Color"]}, ${record["Description"]});`         
                const product_id_query = await prisma.$queryRaw`SELECT MAX("id") FROM "Product";`
                return product_id_query[0].max
            }
    
        }

        async function checkUser(record){
            // check if the user exists
            const exists_user = await prisma.$queryRaw`SELECT EXISTS(SELECT id FROM "User" WHERE "email" = ${record["Email"]});`
            if (exists_user[0].exists == true){
                // if user exists extract the id to be insert into the new order query
                const user_id_query = await prisma.$queryRaw`SELECT id FROM "User" WHERE "email" = ${record["Email"]};` 
                return user_id_query[0].id
            }
            else{
                // if not exists, insert new product into the DB and extract the id to be insert into the new order query
                const user_insert_query = await prisma.$queryRaw`INSERT INTO "User" ("firstname", "lastname", "username", "email", "phone", "address", "zip", "city", "country") VALUES (${record["First Name"]}, ${record["Last Name"]}, ${record["Username"]}, ${record["Email"]}, ${record["Phone"]}, ${record["Address"]}, ${record["Zip"]}, ${record["City"]}, ${record["Country"]});`  
                const user_id_query = await prisma.$queryRaw`SELECT MAX("id") FROM "User";`
                return user_id_query[0].max
            }
        }
        
        async function insertOrder(record){
            const product_id = await checkProduct(record)
            const user_id = await checkUser(record)
    
            // new order query
            const query_order = await prisma.$queryRaw`INSERT INTO "Order" ("externalId", "orderDate", "userId", "productId", "price", "quantity") VALUES (${record["Order ID"]}, NOW(), ${user_id}, ${product_id}, ${parseFloat(record["Price"])}, ${parseInt(record["Quantity"])});`         
        }

        insertOrder(record)
    } catch (e) {
        console.log("Insert Function Error:")
        console.log(e)
        // in the following line we insert the row number and the record that generated the error inside the invalidInserts array
        invalidInserts.push(counter, record)
    }

}

readCSVwriteData()
