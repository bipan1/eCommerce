/*
  Warnings:

  - You are about to drop the column `cartId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add userId column to Cart table as nullable first
ALTER TABLE "Cart" ADD COLUMN "userId" INTEGER;

-- Step 2: Populate userId in Cart table based on existing User.cartId relationships
UPDATE "Cart" SET "userId" = "User"."id" 
FROM "User" 
WHERE "Cart"."id" = "User"."cartId";

-- Step 3: Delete orphaned carts that don't have a corresponding user
DELETE FROM "Cart" WHERE "userId" IS NULL;

-- Step 4: Make userId column NOT NULL
ALTER TABLE "Cart" ALTER COLUMN "userId" SET NOT NULL;

-- Step 5: Drop the foreign key constraint from User to Cart
ALTER TABLE "User" DROP CONSTRAINT "User_cartId_fkey";

-- Step 6: Drop the unique index on User.cartId
DROP INDEX "User_cartId_key";

-- Step 7: Drop the cartId column from User table
ALTER TABLE "User" DROP COLUMN "cartId";

-- Step 8: Create unique index on Cart.userId
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- Step 9: Add foreign key constraint from Cart to User
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
