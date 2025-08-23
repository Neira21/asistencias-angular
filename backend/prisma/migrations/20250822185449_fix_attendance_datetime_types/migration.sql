/*
  Warnings:

  - You are about to alter the column `entryTime` on the `attendance` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `date` on the `attendance` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `attendance` MODIFY `entryTime` DATETIME(3) NOT NULL,
    MODIFY `date` DATETIME(3) NOT NULL;
