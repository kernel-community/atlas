/*
  Warnings:

  - You are about to drop the column `cityId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_cityId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "cityId";

-- DropTable
DROP TABLE "City";
