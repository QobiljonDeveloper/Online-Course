-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "public"."payments" ADD COLUMN     "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING';
