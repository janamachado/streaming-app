/*
  Warnings:

  - You are about to alter the column `name` on the `Playlist` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - You are about to alter the column `description` on the `Playlist` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.

*/
-- AlterTable
ALTER TABLE "Playlist" ALTER COLUMN "name" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(200);
