-- CreateTable
CREATE TABLE "cta_events" (
    "id" SERIAL NOT NULL,
    "impression_id" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "trigger" TEXT,
    "path" TEXT,
    "device" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cta_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cta_events_created_at_idx" ON "cta_events"("created_at");

-- CreateIndex
CREATE INDEX "cta_events_event_type_created_at_idx" ON "cta_events"("event_type", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "cta_events_impression_id_event_type_key" ON "cta_events"("impression_id", "event_type");
