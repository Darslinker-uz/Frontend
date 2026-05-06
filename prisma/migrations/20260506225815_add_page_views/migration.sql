-- CreateTable
CREATE TABLE "page_views" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "user_agent" TEXT,
    "bot_name" TEXT,
    "bot_category" TEXT,
    "session_id" TEXT,
    "ip_hash" TEXT,
    "referrer" TEXT,
    "country" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_views_created_at_idx" ON "page_views"("created_at");

-- CreateIndex
CREATE INDEX "page_views_bot_name_created_at_idx" ON "page_views"("bot_name", "created_at");

-- CreateIndex
CREATE INDEX "page_views_bot_category_created_at_idx" ON "page_views"("bot_category", "created_at");
