const { prisma } = require("../prisma-client");
const { get } = require("../routes/upload");

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
async function queryOrders(dateMin, dateMax, productId=undefined, name=undefined) {
  const getOrders = await prisma.product.findMany({
    where: {
      Order: {
        some: {
          orderDate: {
            gte: new Date(dateMin),
            lte: new Date(dateMax),
          },
        },
      },
      id: productId,
      name: name
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          Order: true
        }
      },
    },
  })
  .catch((e) => {
    throw e
  })
  const getTurnover = await prisma.order.groupBy({
    by: ['productId'],
    where: {
      orderDate: {
        gte: new Date(dateMin),
        lte: new Date(dateMax),
      },
      productId: productId,
      product: {
        name: name
      }
    },
    orderBy: {
      _sum:{
        price: 'desc'
      },
    },
    _sum:{
      quantity:true,
      price: true,
    },
  })
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
  //console.dir(getTurnover, { depth: null });

  const turnover = getTurnover.map((obj) => {
    return {
      total: obj._sum.quantity * obj._sum.price,
      id: obj.productId,
      name: getOrders.find(o => o.id == obj.productId).name,
      ordersCount: getOrders.find(o => o.id == obj.productId)._count.Order
    }
  })
  
  console.log(turnover)
  return turnover
};


module.exports = {
  queryOrders
  }


queryOrders("2022-03-10", "2022-03-11")//, undefined, 'Incredible Granite Chair')
// aggiungere un giorno nella data finale 