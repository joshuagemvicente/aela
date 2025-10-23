-- AlterTable
ALTER TABLE "public"."note" ADD COLUMN     "workspaceId" TEXT;

-- CreateIndex
CREATE INDEX "note_workspaceId_idx" ON "public"."note"("workspaceId");

-- AddForeignKey
ALTER TABLE "public"."note" ADD CONSTRAINT "note_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
