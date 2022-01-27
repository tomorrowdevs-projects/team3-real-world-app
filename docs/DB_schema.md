# DB SCHEMA

## Table 1: USER

| FIELD NAME | TYPE |
| ---------- | ---- |
| id | int, primary key, autoincrement |
| firstname | string, varchar (50) |
| lastname | string, varchar (50) |
| username | string, varchar (20) |
| email | string, varchar (100) |
| phone | string, varchar (50) |
| address | string, varchar (155) |
| zip | int |
| city | string, varchar (50) |
| country | string, varchar (50) |
| created_at | timestampz |
| updated_at | timestampz |


## Table 2: PRODUCT

| FIELD NAME | TYPE |
| ---------- | ---- |
| id | int, primary key, autoincrement |
| name | string, varchar (150) |
| type | string, varchar (50) |
| color | string, varchar (50) |
| description | string, text |
| created_at | timestampz |
| updated_at | timestampz |


## Table 3: ORDER

| FIELD NAME | TYPE |
| ---------- | ---- |
| id | int, primary key, autoincrement |
| external_id | string, varchar (20) |
| date | timestampz |
| user_id | int |
| product_id | int |
| price | float |
| quantity | int |
| created_at | timestampz |
| updated_at | timestampz |


> NOTE
> <br/> _external_id_ is the id of the order, imported from csv file, not the auto-generated one by the database (that is just _id_)
> <br/> _date_ is the date of the order
> <br/> _user_id_ and _product_id_ are related to _user_ and _product_ tables with a many to many relation






# PRISMA

The team decided to use the ORM [Prisma] to create the DB tables. 

To create a new project, you need to:
- create your local postgres server
- create your local database
- configure your node.js project
- initialize your node.js project
- install prisma in your terminal
- setup your prisma project
```sh
npm init -y
npm install prisma --save-dev
npx prisma init 
```
- connect your DB, by setting the url field of the datasource block in your Prisma schema to your database connection URL. 
`prisma/schema.prisma`
datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

> the url is set in the `.env` file
> DATABASE_URL = "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
> Example:
> DATABASE_URL = "postgresql://admin:mypassword@localhost:5432/td_team3?schema=SCHEMA"

- create the schema inside `prisma/schema.prisma``
```sh
model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  firstname String   @db.VarChar(50)
  lastname  String   @db.VarChar(50)
  username  String   @db.VarChar(20)
  email     String   @db.VarChar(100)
  phone     String   @db.VarChar(30)
  address   String   @db.VarChar(255)
  zip       Int
  city      String   @db.VarChar(50)
  country   String   @db.VarChar(50)
  Order     Order[]
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(150)
  type        String   @db.VarChar(50)
  color       String   @db.VarChar(50)
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  Order       Order[]
}

model Order {
  id         Int      @id @default(autoincrement())
  externalId String   @db.VarChar(20)
  orderDate       DateTime @db.Timestamptz(3)
  user       User     @relation(fields: [userId], references: [id])
  userId     Int
  product    Product  @relation(fields: [productId], references: [id])
  productId  Int
  price      Float    @db.DoublePrecision
  quantity   Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

[Prisma] : <https://www.prisma.io/>