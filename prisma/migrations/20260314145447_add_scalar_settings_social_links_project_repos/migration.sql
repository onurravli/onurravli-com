-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "footerCopyright" TEXT NOT NULL DEFAULT 'Made with ❤️ by Onur Ravli.',
ADD COLUMN     "headerHideOnScroll" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "headerShortcuts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "headerShowActivePill" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "headerShowIcons" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "headerShowIndicator" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "headerTouchToShowEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "headerTouchToShowThreshold" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "imagePath" TEXT NOT NULL DEFAULT 'https://avatars.githubusercontent.com/u/47084109',
ADD COLUMN     "navigationBehavior" TEXT NOT NULL DEFAULT 'smooth',
ADD COLUMN     "navigationShowChips" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "navigationWithKeyboard" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "opengraphSubtitle" TEXT NOT NULL DEFAULT 'Available for collaboration';

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "iconPkg" TEXT NOT NULL DEFAULT 'fa',
    "iconName" TEXT NOT NULL,
    "iconSize" INTEGER NOT NULL DEFAULT 24,
    "target" TEXT NOT NULL DEFAULT '_blank',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRepo" (
    "id" SERIAL NOT NULL,
    "repo" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectRepo_pkey" PRIMARY KEY ("id")
);
