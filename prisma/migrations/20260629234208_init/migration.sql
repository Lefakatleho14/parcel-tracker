-- CreateEnum
CREATE TYPE "ParcelStatus" AS ENUM ('PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'EXCEPTION', 'RETURNED');

-- CreateTable
CREATE TABLE "parcels" (
    "tracking_number" VARCHAR(20) NOT NULL,
    "sender_name" VARCHAR(100) NOT NULL,
    "receiver_name" VARCHAR(100) NOT NULL,
    "status" "ParcelStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parcels_pkey" PRIMARY KEY ("tracking_number")
);

-- CreateTable
CREATE TABLE "tracking_events" (
    "event_id" TEXT NOT NULL,
    "tracking_number" VARCHAR(20) NOT NULL,
    "status" "ParcelStatus" NOT NULL,
    "location" VARCHAR(200) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracking_events_pkey" PRIMARY KEY ("event_id")
);

-- CreateIndex
CREATE INDEX "tracking_events_tracking_number_idx" ON "tracking_events"("tracking_number");

-- CreateIndex
CREATE INDEX "tracking_events_tracking_number_timestamp_idx" ON "tracking_events"("tracking_number", "timestamp" DESC);

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_tracking_number_fkey" FOREIGN KEY ("tracking_number") REFERENCES "parcels"("tracking_number") ON DELETE CASCADE ON UPDATE CASCADE;
