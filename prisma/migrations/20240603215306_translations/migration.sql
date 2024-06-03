/*
  Warnings:

  - You are about to drop the column `description` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - Added the required column `nameEn` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameKz` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameRu` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Model" DROP COLUMN "description",
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "descriptionKz" TEXT,
ADD COLUMN     "descriptionRu" TEXT,
ADD COLUMN     "detailedDescriptionEn" TEXT,
ADD COLUMN     "detailedDescriptionKz" TEXT,
ADD COLUMN     "detailedDescriptionRu" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "trackingNumber" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "name",
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "nameKz" TEXT NOT NULL,
ADD COLUMN     "nameRu" TEXT NOT NULL;
