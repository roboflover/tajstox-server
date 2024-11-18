/*
  Warnings:

  - You are about to drop the `OrderCatalog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "OrderCatalog";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "telegramId" TEXT NOT NULL,
    "authDate" TIMESTAMP(3) NOT NULL,
    "authPayload" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");
