/*
  Warnings:

  - The `orderStatus` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[combination]` on the table `LotteryTicket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PROCESSING', 'WAY', 'PICKUP', 'DELIVERED', 'CANCELED');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderStatus",
ADD COLUMN     "orderStatus" "Status" NOT NULL DEFAULT 'PROCESSING';

-- CreateIndex
CREATE UNIQUE INDEX "LotteryTicket_combination_key" ON "LotteryTicket"("combination");
