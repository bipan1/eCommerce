/*
  Warnings:

  - You are about to drop the column `hasStock` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "hasStock",
ADD COLUMN     "outofStock" BOOLEAN NOT NULL DEFAULT false;
