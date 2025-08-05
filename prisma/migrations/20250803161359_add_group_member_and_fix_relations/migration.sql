/*
  Warnings:

  - You are about to drop the column `usersId` on the `private_chat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user1_id,user2_id,course_id]` on the table `private_chat` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."private_chat" DROP CONSTRAINT "private_chat_usersId_fkey";

-- AlterTable
ALTER TABLE "public"."private_chat" DROP COLUMN "usersId";

-- CreateTable
CREATE TABLE "public"."group_members" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_members_group_id_user_id_key" ON "public"."group_members"("group_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "private_chat_user1_id_user2_id_course_id_key" ON "public"."private_chat"("user1_id", "user2_id", "course_id");

-- AddForeignKey
ALTER TABLE "public"."group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_members" ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
