/*
  Warnings:

  - You are about to drop the column `isActive` on the `LotoDay` table. All the data in the column will be lost.
  - You are about to drop the column `orderStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paid` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalCost` on the `Order` table. All the data in the column will be lost.
  - Added the required column `totalPrice` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "LotoDay" DROP COLUMN "isActive";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderStatus",
DROP COLUMN "paid",
DROP COLUMN "totalCost",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PROCESSING',
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;
