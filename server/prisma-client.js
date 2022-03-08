const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient()
/*{
    log: [
        "query"
    ],
  });
*/
module.exports = {
    prisma,
    Prisma
}