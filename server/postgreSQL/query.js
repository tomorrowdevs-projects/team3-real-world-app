const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function queryAll() {
    const allOrders = await prisma.order.findMany({
        include: {
            user: true,
            product: true,
        },
    })
    .catch((e) => {
      throw e
    })
    .finally(async () => {
      await prisma.$disconnect()
    });
    console.dir(allOrders, { depth: null });

    return allOrders
};



module.exports = {
    queryAll
  }