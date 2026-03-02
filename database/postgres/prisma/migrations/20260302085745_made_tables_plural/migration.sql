/*
  Warnings:

  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Closet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClosetItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemBrand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Outfit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OutfitItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Closet" DROP CONSTRAINT "Closet_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClosetItem" DROP CONSTRAINT "ClosetItem_closetId_fkey";

-- DropForeignKey
ALTER TABLE "ClosetItem" DROP CONSTRAINT "ClosetItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ItemBrand" DROP CONSTRAINT "ItemBrand_brandId_fkey";

-- DropForeignKey
ALTER TABLE "ItemBrand" DROP CONSTRAINT "ItemBrand_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Outfit" DROP CONSTRAINT "Outfit_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "OutfitItem" DROP CONSTRAINT "OutfitItem_closetItemId_fkey";

-- DropForeignKey
ALTER TABLE "OutfitItem" DROP CONSTRAINT "OutfitItem_outfitId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_writtenBy_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_countryId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropTable
DROP TABLE "Brand";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Closet";

-- DropTable
DROP TABLE "ClosetItem";

-- DropTable
DROP TABLE "Country";

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "ItemBrand";

-- DropTable
DROP TABLE "Outfit";

-- DropTable
DROP TABLE "OutfitItem";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roleId" INTEGER NOT NULL,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfits" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID NOT NULL,

    CONSTRAINT "outfits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit_items" (
    "id" BIGSERIAL NOT NULL,
    "outfitId" BIGINT NOT NULL,
    "closetItemId" BIGINT NOT NULL,

    CONSTRAINT "outfit_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" BIGSERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "writtenBy" UUID NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_brands" (
    "itemId" BIGINT NOT NULL,
    "brandId" INTEGER NOT NULL,

    CONSTRAINT "item_brands_pkey" PRIMARY KEY ("itemId","brandId")
);

-- CreateTable
CREATE TABLE "items" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" BIGSERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "itemId" BIGINT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "closets" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    CONSTRAINT "closets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "closet_items" (
    "id" BIGSERIAL NOT NULL,
    "itemId" BIGINT NOT NULL,
    "closetId" BIGINT NOT NULL,

    CONSTRAINT "closet_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_key" ON "roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "outfit_items_outfitId_closetItemId_key" ON "outfit_items"("outfitId", "closetItemId");

-- CreateIndex
CREATE UNIQUE INDEX "closet_items_itemId_closetId_key" ON "closet_items"("itemId", "closetId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfits" ADD CONSTRAINT "outfits_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_items" ADD CONSTRAINT "outfit_items_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "outfits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_items" ADD CONSTRAINT "outfit_items_closetItemId_fkey" FOREIGN KEY ("closetItemId") REFERENCES "closet_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_writtenBy_fkey" FOREIGN KEY ("writtenBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_brands" ADD CONSTRAINT "item_brands_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_brands" ADD CONSTRAINT "item_brands_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "closets" ADD CONSTRAINT "closets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "closet_items" ADD CONSTRAINT "closet_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "closet_items" ADD CONSTRAINT "closet_items_closetId_fkey" FOREIGN KEY ("closetId") REFERENCES "closets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
