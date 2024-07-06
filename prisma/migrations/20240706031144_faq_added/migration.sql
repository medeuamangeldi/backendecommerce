-- CreateTable
CREATE TABLE "Faq" (
    "id" SERIAL NOT NULL,
    "questionKz" TEXT NOT NULL,
    "questionRu" TEXT NOT NULL,
    "questionEn" TEXT NOT NULL,
    "answerKz" TEXT NOT NULL,
    "answerRu" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);
