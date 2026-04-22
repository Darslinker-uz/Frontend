-- AlterEnum
ALTER TYPE "LeadStatus" ADD VALUE 'not_interested';

-- CreateTable
CREATE TABLE "bot_pending_actions" (
    "id" SERIAL NOT NULL,
    "chat_id" TEXT NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "message_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bot_pending_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bot_pending_actions_chat_id_key" ON "bot_pending_actions"("chat_id");
