/*
  Warnings:

  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `City` table. All the data in the column will be lost.
  - Added the required column `nameEn` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameKz` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameRu` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameKz` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameRu` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "nameKz" TEXT NOT NULL,
ADD COLUMN     "nameRu" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "City" DROP COLUMN "name",
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "nameKz" TEXT NOT NULL,
ADD COLUMN     "nameRu" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GlobalConfig" ADD COLUMN     "ticketPrice" DOUBLE PRECISION NOT NULL DEFAULT 2000;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
