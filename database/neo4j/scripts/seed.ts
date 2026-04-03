/**
 * database/neo4j/seed.ts
 *
 * Wipes and re-seeds the Neo4j database with realistic dev/demo data.
 * ⚠️  DEV ONLY — this deletes ALL nodes and relationships before seeding.
 *
 * Run with:
 *   npx ts-node --esm src/database/neo4j/seed.ts
 */

import { randomUUID } from "crypto";
import { neogma } from "../neogma-client.js";

import {
  getRoleModel,
  getCountryModel,
  getBrandModel,
  getCategoryModel,
  getImageModel,
  getItemModel,
  getOutfitModel,
  getReviewModel,
  getClosetModel,
  getUserModel,
} from "../models/index.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset<T>(arr: T[], min: number, max: number): T[] {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
}

function isoNow(daysAgo = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// Raw seed data
// ─────────────────────────────────────────────────────────────────────────────

const ROLES = ["admin", "user", "moderator"];

const COUNTRIES = [
  { name: "Denmark",        countryCode: "DK" },
  { name: "Sweden",         countryCode: "SE" },
  { name: "Norway",         countryCode: "NO" },
  { name: "Germany",        countryCode: "DE" },
  { name: "United States",  countryCode: "US" },
  { name: "France",         countryCode: "FR" },
];

const BRANDS = [
  "Nike", "Adidas", "Zara", "H&M", "Gucci",
  "Prada", "Levi's", "Ralph Lauren", "Tommy Hilfiger", "Uniqlo",
];

const CATEGORIES = [
  "Tops", "Bottoms", "Shoes", "Outerwear",
  "Accessories", "Dresses", "Activewear", "Formal",
];

const USERS = [
  { id: 1,  firstName: "Emma",    lastName: "Hansen",    email: "emma.hansen@example.com" },
  { id: 2,  firstName: "Liam",    lastName: "Nielsen",   email: "liam.nielsen@example.com" },
  { id: 3,  firstName: "Sofia",   lastName: "Berg",      email: "sofia.berg@example.com" },
  { id: 4,  firstName: "Noah",    lastName: "Lindqvist", email: "noah.lindqvist@example.com" },
  { id: 5,  firstName: "Astrid",  lastName: "Eriksson",  email: "astrid.eriksson@example.com" },
  { id: 6,  firstName: "Oliver",  lastName: "Jensen",    email: "oliver.jensen@example.com" },
  { id: 7,  firstName: "Freya",   lastName: "Andersen",  email: "freya.andersen@example.com" },
  { id: 8,  firstName: "Magnus",  lastName: "Larsson",   email: "magnus.larsson@example.com" },
  { id: 9,  firstName: "Maja",    lastName: "Johansson", email: "maja.johansson@example.com" },
  { id: 10, firstName: "Viktor",  lastName: "Christensen",email: "viktor.christensen@example.com" },
];

const ITEM_NAMES = [
  "Classic White Tee",     "Slim Fit Jeans",       "Leather Sneakers",
  "Wool Overcoat",         "Floral Summer Dress",  "Running Shorts",
  "Cashmere Sweater",      "Cargo Pants",          "Canvas Backpack",
  "Silk Blouse",           "Chino Trousers",        "Chelsea Boots",
  "Denim Jacket",          "Pleated Skirt",         "Polo Shirt",
  "Compression Leggings",  "Trench Coat",           "Knit Beanie",
  "Oxford Shirt",          "Platform Sandals",
];

const OUTFIT_DATA = [
  { name: "Copenhagen Street Style", style: "casual" },
  { name: "Office Ready",            style: "formal" },
  { name: "Weekend Brunch",          style: "smart-casual" },
  { name: "Summer Festival",         style: "bohemian" },
  { name: "Gym to Brunch",           style: "athleisure" },
  { name: "Date Night",              style: "elegant" },
  { name: "Scandinavian Minimal",    style: "minimalist" },
  { name: "Rainy Day Layers",        style: "casual" },
  { name: "Business Travel",         style: "formal" },
  { name: "Sunday Stroll",           style: "casual" },
  { name: "Gallery Opening",         style: "smart-casual" },
  { name: "Ski Lodge Après",         style: "cozy" },
];

const REVIEW_TEXTS = [
  "Absolutely love this outfit, get so many compliments!",
  "Great combination, very versatile for different occasions.",
  "The items go together perfectly. Would recommend.",
  "Decent outfit but the shoes don't quite match the rest.",
  "This is my go-to look for work meetings.",
  "Bold choices but it really works!",
  "Simple and clean. Classic for a reason.",
  "Not my personal style but well put together.",
  "The color palette is chef's kiss.",
  "Wore this to a wedding and felt amazing.",
];

const IMAGE_URLS = [
  "https://cdn.example.com/images/item-001.jpg",
  "https://cdn.example.com/images/item-002.jpg",
  "https://cdn.example.com/images/item-003.jpg",
  "https://cdn.example.com/images/item-004.jpg",
  "https://cdn.example.com/images/item-005.jpg",
  "https://cdn.example.com/images/item-006.jpg",
  "https://cdn.example.com/images/item-007.jpg",
  "https://cdn.example.com/images/item-008.jpg",
];

// ─────────────────────────────────────────────────────────────────────────────
// Seed function
// ─────────────────────────────────────────────────────────────────────────────

async function seed(): Promise<void> {
  await neogma.verifyConnectivity();
  console.log("✅ Connected to Neo4j\n");

  // ── 1. WIPE ────────────────────────────────────────────────────────────────
  console.log("🗑️  Wiping all existing nodes and relationships...");
  const session = neogma.driver.session();
  await session.run("MATCH (n) DETACH DELETE n");
  await session.close();
  console.log("   Done.\n");

  // ── 2. ROLES ───────────────────────────────────────────────────────────────
  console.log("🌱 Seeding roles...");
  const RoleModel = getRoleModel();
  const roleInstances = await Promise.all(
    ROLES.map((name) => RoleModel.createOne({ name }))
  );
  console.log(`   Created ${roleInstances.length} roles: ${ROLES.join(", ")}\n`);

  // ── 3. COUNTRIES ───────────────────────────────────────────────────────────
  console.log("🌱 Seeding countries...");
  const CountryModel = getCountryModel();
  const countryInstances = await Promise.all(
    COUNTRIES.map((c) => CountryModel.createOne(c))
  );
  console.log(`   Created ${countryInstances.length} countries\n`);

  // ── 4. BRANDS ──────────────────────────────────────────────────────────────
  console.log("🌱 Seeding brands...");
  const BrandModel = getBrandModel();
  const brandInstances = await Promise.all(
    BRANDS.map((name) => BrandModel.createOne({ name }))
  );
  console.log(`   Created ${brandInstances.length} brands\n`);

  // ── 5. CATEGORIES ──────────────────────────────────────────────────────────
  console.log("🌱 Seeding categories...");
  const CategoryModel = getCategoryModel();
  const categoryInstances = await Promise.all(
    CATEGORIES.map((name) => CategoryModel.createOne({ name }))
  );
  console.log(`   Created ${categoryInstances.length} categories\n`);

  // ── 6. ITEMS ───────────────────────────────────────────────────────────────
  console.log("🌱 Seeding items...");
  const ItemModel = getItemModel();
  const ImageModel = getImageModel();

  const itemInstances = await Promise.all(
    ITEM_NAMES.map(async (name, i) => {
      const item = await ItemModel.createOne({
        id: i + 1,
        name,
        price: parseFloat((20 + Math.random() * 480).toFixed(2)),
      });

      // Relate to a random brand
      await item.relateTo({
        alias: "brand",
        where: { name: randomFrom(BRANDS) },
      });

      // Relate to a random category
      await item.relateTo({
        alias: "category",
        where: { name: randomFrom(CATEGORIES) },
      });

      // Relate to a random country of origin
      await item.relateTo({
        alias: "country",
        where: { countryCode: randomFrom(COUNTRIES).countryCode },
      });

      // Create 1-2 images and relate them
      const imageUrls = randomSubset(IMAGE_URLS, 1, 2);
      for (const url of imageUrls) {
        const image = await ImageModel.createOne({ imageId: randomUUID(), url });
        await item.relateTo({
          alias: "images",
          where: { imageId: image.imageId },
        });
      }

      return item;
    })
  );
  console.log(`   Created ${itemInstances.length} items\n`);

  // ── 7. OUTFITS ─────────────────────────────────────────────────────────────
  console.log("🌱 Seeding outfits...");
  const OutfitModel = getOutfitModel();

  const outfitInstances = await Promise.all(
    OUTFIT_DATA.map(async (data, i) => {
      const outfit = await OutfitModel.createOne({
        id: i + 1,
        name: data.name,
        style: data.style,
      });

      // Each outfit contains 2-5 random items
      const selectedItems = randomSubset(itemInstances, 2, 5);
      for (const item of selectedItems) {
        await outfit.relateTo({
          alias: "items",
          where: { id: item.id },
        });
      }

      return outfit;
    })
  );
  console.log(`   Created ${outfitInstances.length} outfits\n`);

  // ── 8. REVIEWS ─────────────────────────────────────────────────────────────
  console.log("🌱 Seeding reviews...");
  const ReviewModel = getReviewModel();

  // Create 15 reviews spread across outfits
  const reviewInstances = await Promise.all(
    Array.from({ length: 15 }, async (_, i) => {
      const review = await ReviewModel.createOne({
        id: i + 1,
        score: 1 + Math.floor(Math.random() * 5), // 1-5
        text: randomFrom(REVIEW_TEXTS),
      });

      // Each review is about a random outfit
      await review.relateTo({
        alias: "outfit",
        where: { id: randomFrom(outfitInstances).id },
      });

      return review;
    })
  );
  console.log(`   Created ${reviewInstances.length} reviews\n`);

  // ── 9. USERS (with closets, roles, countries, outfits, reviews) ────────────
  console.log("🌱 Seeding users...");
  const UserModel = getUserModel();
  const ClosetModel = getClosetModel();

  let closetIdCounter = 1;
  let userIdx = 0;

  for (const userData of USERS) {
    const user = await UserModel.createOne(userData);

    // Assign a role (first user is admin, rest are users)
    await user.relateTo({
      alias: "role",
      where: { name: userIdx === 0 ? "admin" : "user" },
    });

    // Assign a country
    await user.relateTo({
      alias: "country",
      where: { countryCode: randomFrom(COUNTRIES).countryCode },
    });

    // Each user gets 1-3 closets
    const closetCount = 1 + Math.floor(Math.random() * 3);
    const closetNames = [
      "My Everyday Looks",
      "Summer 2025",
      "Work Wardrobe",
      "Special Occasions",
      "Wishlist",
    ];

    for (let c = 0; c < closetCount; c++) {
      const closet = await ClosetModel.createOne({
        id: closetIdCounter++,
        name: randomFrom(closetNames),
        description: "Curated by " + userData.firstName,
        isPublic: Math.random() > 0.4, // 60% chance public
      });

      // Relate user → closet with createdAt on the relationship
      await user.relateTo({
        alias: "closets",
        where: { id: closet.id },
        properties: { createdAt: isoNow(Math.floor(Math.random() * 90)) },
      });

      // Closet stores 3-8 random items
      const storedItems = randomSubset(itemInstances, 3, 8);
      for (const item of storedItems) {
        await closet.relateTo({
          alias: "items",
          where: { id: item.id },
        });
      }

      // Closet creates 1-2 outfits
      const createdOutfits = randomSubset(outfitInstances, 1, 2);
      for (const outfit of createdOutfits) {
        await closet.relateTo({
          alias: "outfits",
          where: { id: outfit.id },
          properties: { createdAt: isoNow(Math.floor(Math.random() * 60)) },
        });
      }
    }

    // User writes 0-2 reviews
    const writtenReviews = randomSubset(reviewInstances, 0, 2);
    for (const review of writtenReviews) {
      await user.relateTo({
        alias: "reviews",
        where: { id: review.id },
        properties: { dateWritten: isoNow(Math.floor(Math.random() * 30)) },
      });
    }

    console.log(`   ✓ ${userData.firstName} ${userData.lastName}`);
    userIdx++;
  }

  console.log(`\n   Created ${USERS.length} users\n`);

  // ── 10. SUMMARY ────────────────────────────────────────────────────────────
  console.log("─────────────────────────────────────────");
  console.log("✅ Seed complete! Summary:");
  console.log(`   Roles:      ${ROLES.length}`);
  console.log(`   Countries:  ${COUNTRIES.length}`);
  console.log(`   Brands:     ${BRANDS.length}`);
  console.log(`   Categories: ${CATEGORIES.length}`);
  console.log(`   Items:      ${itemInstances.length}`);
  console.log(`   Outfits:    ${outfitInstances.length}`);
  console.log(`   Reviews:    ${reviewInstances.length}`);
  console.log(`   Users:      ${USERS.length}`);
  console.log("─────────────────────────────────────────");
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────────────

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await neogma.driver.close();
  });