-- Add category column to Product table
ALTER TABLE "Product" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'uncategorized';

-- Update existing products to have a category
UPDATE "Product" SET "category" = 'uncategorized' WHERE "category" IS NULL; 