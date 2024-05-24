/*
  Warnings:

  - You are about to drop the column `lotoDate` on the `Prize` table. All the data in the column will be lost.
  - Added the required column `lotoDayId` to the `Prize` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prize" DROP COLUMN "lotoDate",
ADD COLUMN     "lotoDayId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "LotoDay" (
    "id" SERIAL NOT NULL,
    "lotoDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LotoDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LotoDay_lotoDate_key" ON "LotoDay"("lotoDate");

-- AddForeignKey
ALTER TABLE "Prize" ADD CONSTRAINT "Prize_lotoDayId_fkey" FOREIGN KEY ("lotoDayId") REFERENCES "LotoDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
