/*
  Warnings:

  - You are about to drop the column `city` on the `DeliveryInfo` table. All the data in the column will be lost.
  - You are about to drop the column `locationUrl` on the `DeliveryInfo` table. All the data in the column will be lost.
  - Added the required column `cityId` to the `DeliveryInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeliveryInfo" DROP COLUMN "city",
DROP COLUMN "locationUrl",
ADD COLUMN     "cityId" INTEGER NOT NULL,
ADD COLUMN     "pickupUrl" TEXT;

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pickupUrls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeliveryInfo" ADD CONSTRAINT "DeliveryInfo_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
