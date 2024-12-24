/*
  Warnings:

  - You are about to drop the column `userId` on the `UserProgress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telegramId]` on the table `UserProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `telegramId` to the `UserProgress` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserProgress_userId_key";

-- AlterTable
ALTER TABLE "UserProgress" DROP COLUMN "userId",
ADD COLUMN     "telegramId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_telegramId_key" ON "UserProgress"("telegramId");
