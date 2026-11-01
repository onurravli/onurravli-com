-- Settings that no longer drive anything on the site.
ALTER TABLE "SiteSettings"
DROP COLUMN "fontSource",
DROP COLUMN "googleFont",
DROP COLUMN "headerHideOnScroll",
DROP COLUMN "headerShortcuts",
DROP COLUMN "headerShowActivePill",
DROP COLUMN "headerShowIcons",
DROP COLUMN "headerShowIndicator",
DROP COLUMN "headerTouchToShowEnabled",
DROP COLUMN "headerTouchToShowThreshold",
DROP COLUMN "navigationBehavior",
DROP COLUMN "navigationShowChips",
DROP COLUMN "navigationWithKeyboard";

-- Icons are resolved from the name alone; package and size were never rendered.
ALTER TABLE "SocialLink"
DROP COLUMN "iconPkg",
DROP COLUMN "iconSize";

-- Skill categories render as plain rows without icons.
ALTER TABLE "SkillCategory"
DROP COLUMN "iconName",
DROP COLUMN "iconPkg",
DROP COLUMN "iconSize";
