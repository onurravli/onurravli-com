-- AlterTable
ALTER TABLE "SiteSettings"
ADD COLUMN "heroPrimaryCtaTarget" TEXT NOT NULL DEFAULT '_self',
ADD COLUMN "heroSecondaryCtaTarget" TEXT NOT NULL DEFAULT '_self';
