-- CreateTable
CREATE TABLE "RecommendationEntry" (
    "id" SERIAL NOT NULL,
    "personName" TEXT NOT NULL,
    "personTitle" TEXT NOT NULL DEFAULT '',
    "personCompany" TEXT NOT NULL DEFAULT '',
    "personAvatarUrl" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL,
    "date" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RecommendationEntry_pkey" PRIMARY KEY ("id")
);
