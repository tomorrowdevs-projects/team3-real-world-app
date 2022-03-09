const { prisma } = require("../prisma-client");

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



// - Sommatoria di numero di ordini e fatturato per Articolo, in un periodo temporale definibile dall’utente 
async function queryOrders(dateMin, dateMax, productId=undefined) {
  // const getOrders = await prisma.order.count({
  //   where: {
  //     orderDate: {
  //       gte: new Date(dateMin),
  //       lte: new Date(dateMax),
  //     },
  //   },
  // })
  // .catch((e) => {
  //   throw e
  // })
  const getTurnover = await prisma.order.groupBy({
    by: ['productId'],
    where: {
      orderDate: {
        gte: new Date(dateMin),
        lte: new Date(dateMax),
      },
      productId : productId,
    },
    _sum:{
      quantity:true,
      price: true,
    }
  })
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
  console.dir(getTurnover, { depth: null });

  const turnover = getTurnover.map((obj) => {
    return {total : obj._sum.quantity * obj._sum.price, id : obj.productId}
  })
  console.log(turnover)
  return turnover
};


module.exports = {
  queryOrders
  }


queryOrders("2022-03-08", "2022-03-09", 36)
// aggiungere un giorno nella data finale 