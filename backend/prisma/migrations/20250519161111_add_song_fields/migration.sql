/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Song` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "cover" TEXT,
ADD COLUMN     "externalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Song_externalId_key" ON "Song"("externalId");

-- CreateIndex
CREATE INDEX "Song_externalId_idx" ON "Song"("externalId");
