-- AlterTable
ALTER TABLE "SiteSettings"
ADD COLUMN "heroPrimaryCtaText" TEXT NOT NULL DEFAULT '',
ADD COLUMN "heroPrimaryCtaHref" TEXT NOT NULL DEFAULT '',
ADD COLUMN "heroSecondaryCtaText" TEXT NOT NULL DEFAULT '',
ADD COLUMN "heroSecondaryCtaHref" TEXT NOT NULL DEFAULT '';
