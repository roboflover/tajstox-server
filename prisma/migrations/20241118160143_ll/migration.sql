-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jwtToken" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
