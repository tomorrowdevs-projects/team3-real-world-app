-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "orderDate" DROP DEFAULT,
ALTER COLUMN "orderDate" SET DATA TYPE TIMESTAMPTZ(3);
