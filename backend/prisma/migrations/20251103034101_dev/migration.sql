/*
  Warnings:

  - You are about to drop the column `content_en` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `content_vi` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `excerpt_en` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `excerpt_vi` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `title_en` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `title_vi` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "content_en",
DROP COLUMN "content_vi",
DROP COLUMN "excerpt_en",
DROP COLUMN "excerpt_vi",
DROP COLUMN "title_en",
DROP COLUMN "title_vi";
