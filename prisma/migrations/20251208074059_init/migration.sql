/*
  Warnings:

  - Added the required column `duration` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `method` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `audit_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "is_success" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "method" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
