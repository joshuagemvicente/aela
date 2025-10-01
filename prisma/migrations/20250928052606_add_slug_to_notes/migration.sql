/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `note` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `note` table without a default value. This is not possible if the table is not empty.

*/
-- Add slug column with default value first
ALTER TABLE "public"."note" ADD COLUMN "slug" TEXT;

-- Update existing rows with generated slugs
UPDATE "public"."note" SET "slug" = CONCAT('untitled-', SUBSTRING("id", 1, 8)) WHERE "slug" IS NULL;

-- Make slug NOT NULL after updating existing rows
ALTER TABLE "public"."note" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "note_slug_key" ON "public"."note"("slug");

-- CreateIndex
CREATE INDEX "note_slug_idx" ON "public"."note"("slug");
