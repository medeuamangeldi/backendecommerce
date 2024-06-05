/*
  Warnings:

  - Added the required column `inStockCount` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GlobalConfig" ADD COLUMN     "ofertaUrl" TEXT;

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "inStockCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
