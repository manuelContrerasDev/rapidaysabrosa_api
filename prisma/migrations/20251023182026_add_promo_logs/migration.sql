-- CreateTable
CREATE TABLE "promo_logs" (
    "id" SERIAL NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "details" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_logs_pkey" PRIMARY KEY ("id")
);
