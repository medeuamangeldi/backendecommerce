/*
  Warnings:

  - Added the required column `weightInKg` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'PAYMENT_PENDING';

-- AlterTable
ALTER TABLE "GlobalConfig" ADD COLUMN     "deliveryPricePerKg" DOUBLE PRECISION NOT NULL DEFAULT 500;

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "weightInKg" DOUBLE PRECISION NOT NULL;
