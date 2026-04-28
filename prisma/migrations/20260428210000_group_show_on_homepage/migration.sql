-- CategoryGroup'ga showOnHomepage flag qo'shish.
-- Mavjud guruhlar default true (hozirgi xulq saqlanadi).
ALTER TABLE "category_groups" ADD COLUMN "show_on_homepage" BOOLEAN NOT NULL DEFAULT true;
