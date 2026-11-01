-- AlterTable
ALTER TABLE "SiteSettings"
ADD COLUMN "fontSource" TEXT NOT NULL DEFAULT 'local',
ADD COLUMN "googleFont" TEXT NOT NULL DEFAULT 'inter';
