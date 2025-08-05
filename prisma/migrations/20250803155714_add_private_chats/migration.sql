-- CreateTable
CREATE TABLE "public"."private_chat" (
    "id" SERIAL NOT NULL,
    "user1_id" INTEGER NOT NULL,
    "user2_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersId" INTEGER,

    CONSTRAINT "private_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."private_message" (
    "id" SERIAL NOT NULL,
    "privateChatId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "private_message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."private_chat" ADD CONSTRAINT "private_chat_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."private_chat" ADD CONSTRAINT "private_chat_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."private_chat" ADD CONSTRAINT "private_chat_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."private_chat" ADD CONSTRAINT "private_chat_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."private_message" ADD CONSTRAINT "private_message_privateChatId_fkey" FOREIGN KEY ("privateChatId") REFERENCES "public"."private_chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."private_message" ADD CONSTRAINT "private_message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
