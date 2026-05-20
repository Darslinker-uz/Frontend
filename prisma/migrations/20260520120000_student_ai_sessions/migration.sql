-- CreateTable
CREATE TABLE "student_ai_sessions" (
    "chat_id" TEXT NOT NULL,
    "step" INTEGER NOT NULL DEFAULT 0,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "daily_date" TEXT,
    "daily_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_ai_sessions_pkey" PRIMARY KEY ("chat_id")
);
