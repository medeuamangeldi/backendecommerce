-- DropForeignKey
ALTER TABLE "LotteryTicket" DROP CONSTRAINT "LotteryTicket_userId_fkey";

-- AlterTable
ALTER TABLE "LotteryTicket" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LotteryTicket" ADD CONSTRAINT "LotteryTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
