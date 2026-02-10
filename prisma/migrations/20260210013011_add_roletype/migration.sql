/*
  Warnings:

  - A unique constraint covering the columns `[card_id]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'USER', 'TEACHER', 'STUDENT', 'PARENT');

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "card_id" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "students_card_id_key" ON "students"("card_id");
