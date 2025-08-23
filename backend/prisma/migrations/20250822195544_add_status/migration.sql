/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `status` ENUM('PRESENT', 'ABSENT') NOT NULL DEFAULT 'ABSENT',
    MODIFY `entryTime` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Attendance_userId_date_key` ON `Attendance`(`userId`, `date`);
