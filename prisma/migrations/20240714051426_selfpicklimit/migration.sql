/*
  Warnings:

  - Added the required column `selfPickDate` to the `DeliveryInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeliveryInfo" ADD COLUMN     "selfPickDate" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GlobalConfig" ADD COLUMN     "selfPickLimit" INTEGER NOT NULL DEFAULT 500;

-- CreateTable
CREATE TABLE "FilledSelfPickDate" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "isFilled" BOOLEAN DEFAULT false,
    "count" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FilledSelfPickDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FilledSelfPickDate_date_key" ON "FilledSelfPickDate"("date");
