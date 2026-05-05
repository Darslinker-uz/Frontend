CREATE TABLE "view_events" (
  "id" SERIAL PRIMARY KEY,
  "listing_id" INTEGER NOT NULL,
  "session_id" TEXT,
  "ip_hash" TEXT,
  "referrer" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "view_events_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "view_events_listing_id_created_at_idx" ON "view_events" ("listing_id", "created_at");
CREATE INDEX "view_events_created_at_idx" ON "view_events" ("created_at");
