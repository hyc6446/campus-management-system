/*
  Warnings:

  - You are about to drop the column `is_enabled` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `revoked` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "audit_logs" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "is_enabled",
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "revoked";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_active",
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;
