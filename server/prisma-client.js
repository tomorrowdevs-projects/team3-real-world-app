const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient()
const prismaError = Prisma.PrismaClientKnownRequestError

module.exports = {
    prisma,
    prismaError
}