/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Features` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Features_userId_key" ON "Features"("userId");
