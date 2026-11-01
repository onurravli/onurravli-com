-- CreateTable
CREATE TABLE "ExperienceEntry" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyWebsite" TEXT NOT NULL DEFAULT '',
    "position" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '🚀',
    "notes" TEXT[],
    "technologies" TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ExperienceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillCategory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "iconPkg" TEXT NOT NULL DEFAULT 'lucide',
    "iconName" TEXT NOT NULL DEFAULT 'code',
    "iconSize" INTEGER NOT NULL DEFAULT 24,
    "skills" TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SkillCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationEntry" (
    "id" SERIAL NOT NULL,
    "school" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "notes" TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EducationEntry_pkey" PRIMARY KEY ("id")
);
