/*
  Warnings:

  - You are about to drop the column `gifts` on the `LotteryTicket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LotteryTicket" DROP COLUMN "gifts";

-- CreateTable
CREATE TABLE "Prize" (
    "id" SERIAL NOT NULL,
    "prizeName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "lotoDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prize_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prize" ADD CONSTRAINT "Prize_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
