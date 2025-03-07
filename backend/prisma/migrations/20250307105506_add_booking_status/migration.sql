/*
  Warnings:

  - You are about to drop the column `name` on the `CheckIn` table. All the data in the column will be lost.
  - Added the required column `aadhaarNumber` to the `CheckIn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestName` to the `CheckIn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "CheckIn" DROP COLUMN "name",
ADD COLUMN     "aadhaarNumber" TEXT NOT NULL,
ADD COLUMN     "guestName" TEXT NOT NULL;
