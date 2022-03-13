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
    //console.dir(allOrders, { depth: null });

    return allOrders
};

// - Sommatoria di numero di ordini e fatturato per Articolo, in un periodo temporale definibile dall’utente 
async function queryOrders(dateMin, dateMax, productId=undefined, name=undefined) {
  const dateMaxResolved = await dateResolver(dateMax);
  const getOrders = await prisma.product.findMany({
    where: {
      Order: {
        some: {
          orderDate: {
            gte: new Date(dateMin),
            lte: new Date(dateMaxResolved),
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
        lte: new Date(dateMaxResolved),
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

  const turnover = getTurnover.map((obj) => {
    return {
      total: obj._sum.quantity * obj._sum.price,
      id: obj.productId,
      name: getOrders.find(o => o.id == obj.productId).name,
      ordersCount: getOrders.find(o => o.id == obj.productId)._count.Order
    }
  })
  .reduce((acc, obj) => {
    return {
      total: acc.total + obj.total,
      ordersCount: acc.ordersCount + obj.ordersCount
    }
  }, 0)
  
  return turnover
};

// Numero di Clienti singoli in un periodo temporale definibile dall’utente 
async function queryUsers(dateMin, dateMax) {
  const dateMaxResolved = await dateResolver(dateMax);
  const getUsers = await prisma.order.findMany({
    where: {
      orderDate: {
        gte: new Date(dateMin),
        lte: new Date(dateMaxResolved),
      },
    },
    distinct: ['userId'],
    select: {
      userId: true,
    },
  })
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  });

  return getUsers.length
};


// Valore medio degli ordini eseguiti 
async function queryTotalOrders(dateMin, dateMax) {
  const dateMaxResolved = await dateResolver(dateMax);
  const getTotalOrders = await prisma.order.aggregate({
    _avg: {
      price: true,
    },
    where: {
      orderDate: {
        gte: new Date(dateMin),
        lte: new Date(dateMaxResolved),
      },
    }
  })
    .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
  
  return getTotalOrders._avg.price.toFixed(2)
};


async function dateResolver (date) {
  let [year, month, day] = date.split('-');
  day = parseInt(day)+1;
  return `${year}-${month}-${day}`
}


module.exports = {
  queryAll,
  queryOrders,
  queryUsers,
  queryTotalOrders
  }

//dateResolver("2022-03-13");
//queryOrders("2022-03-08", "2022-03-10", 13435)//, 'Incredible Granite Chair')  
//queryUsers("2022-03-08", "2022-03-13")
//queryTotalOrders("2022-03-08", "2022-03-13")