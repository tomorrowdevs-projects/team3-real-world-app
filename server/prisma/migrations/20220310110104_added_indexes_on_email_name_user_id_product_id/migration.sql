/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "unique_product";

-- DropIndex
DROP INDEX "unique_email";

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order" USING HASH ("userId");
CREATE INDEX "Order_productId_idx" ON "Order" USING HASH ("productId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_product" ON "Product"("name");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product" USING HASH ("name");

-- CreateIndex
CREATE UNIQUE INDEX "unique_email" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User" USING HASH ("email");
