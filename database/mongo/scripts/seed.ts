import "dotenv/config";
import { randomUUID } from "crypto";
import { connectMongo, closeMongo } from "../mongoose-client.js";

import { Country, Role, Category, Brand, User, Item, Closet, Outfit } from "../models/index.js";

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

/** Drop all documents from every collection so we start clean. */
async function clearAll() {
  await Promise.all([
    Country.deleteMany({}),
    Role.deleteMany({}),
    Category.deleteMany({}),
    Brand.deleteMany({}),
    User.deleteMany({}),
    Item.deleteMany({}),
    Closet.deleteMany({}),
    Outfit.deleteMany({}),
  ]);
}

// ---------------------------------------------------------------------------
// seed
// ---------------------------------------------------------------------------

async function seed() {
  await connectMongo();
  await clearAll();

  // ── 1. countries ──────────────────────────────────────────────────────────
  const [denmark, usa] = await Country.insertMany([
    { id: randomUUID(), name: "Denmark",       countryCode: "DK" },
    { id: randomUUID(), name: "United States", countryCode: "US" },
  ]);
  console.log("[seed] countries ✓");

  // ── 2. roles ──────────────────────────────────────────────────────────────
  const [adminRole, userRole, modRole] = await Role.insertMany([
    { id: randomUUID(), role: "admin" },
    { id: randomUUID(), role: "user" },
    { id: randomUUID(), role: "moderator" },
  ]);
  console.log("[seed] roles ✓");

  // ── 3. categories ─────────────────────────────────────────────────────────
  const [tops, bottoms, outerwear, footwear] = await Category.insertMany([
    { id: randomUUID(), name: "Tops" },
    { id: randomUUID(), name: "Bottoms" },
    { id: randomUUID(), name: "Outerwear" },
    { id: randomUUID(), name: "Footwear" },
  ]);
  console.log("[seed] categories ✓");

  // ── 4. brands ─────────────────────────────────────────────────────────────
  const [norseProjects, apc] = await Brand.insertMany([
    { id: randomUUID(), name: "Norse Projects", countryId: denmark!._id },
    { id: randomUUID(), name: "A.P.C.",          countryId: denmark!._id },
  ]);
  console.log("[seed] brands ✓");

  // ── 5. users ──────────────────────────────────────────────────────────────
  const [alice, bob, carol, dave] = await User.insertMany([
    {
      id: randomUUID(),
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Smith",
      roleId: adminRole!._id,
      countryId: denmark!._id,
    },
    {
      id: randomUUID(),
      email: "bob@example.com",
      firstName: "Bob",
      lastName: "Johnson",
      roleId: userRole!._id,
      countryId: usa!._id,
    },
    {
      id: randomUUID(),
      email: "carol@example.com",
      firstName: "Carol",
      lastName: "Williams",
      roleId: userRole!._id,
      countryId: usa!._id,
    },
    {
      id: randomUUID(),
      email: "dave@example.com",
      firstName: "Dave",
      lastName: "Brown",
      roleId: modRole!._id,
      countryId: denmark!._id,
    },
  ]);
  console.log("[seed] users ✓");

  // ── 6. items ──────────────────────────────────────────────────────────────
  const [woolJacket, straightJeans, whiteShirt, leatherBoots] =
    await Item.insertMany([
      {
        id: randomUUID(),
        name: "Wool Jacket",
        price: 1299.0,
        categoryId: outerwear!._id,
        brandIds: [norseProjects!._id],
        images: [{ id: randomUUID(), url: "https://cdn.example.com/wool-jacket.jpg" }],
      },
      {
        id: randomUUID(),
        name: "Straight Jeans",
        price: 899.0,
        categoryId: bottoms!._id,
        brandIds: [apc!._id],
        images: [{ id: randomUUID(), url: "https://cdn.example.com/straight-jeans.jpg" }],
      },
      {
        id: randomUUID(),
        name: "White Oxford Shirt",
        price: 599.0,
        categoryId: tops!._id,
        brandIds: [norseProjects!._id, apc!._id], // collab item
        images: [{ id: randomUUID(), url: "https://cdn.example.com/white-shirt.jpg" }],
      },
      {
        id: randomUUID(),
        name: "Leather Chelsea Boots",
        price: 1599.0,
        categoryId: footwear!._id,
        brandIds: [norseProjects!._id],
        images: [{ id: randomUUID(), url: "https://cdn.example.com/chelsea-boots.jpg" }],
      },
    ]);
  console.log("[seed] items ✓");

  // ── 7. closets ────────────────────────────────────────────────────────────
  const [aliceCloset, bobCloset] = await Closet.insertMany([
    {
      id: randomUUID(),
      name: "Alice's Wardrobe",
      description: "My everyday essentials",
      isPublic: true,
      userId: alice!._id,
      itemIds: [woolJacket!._id, whiteShirt!._id, leatherBoots!._id],
      sharedWith: [{ userId: bob!._id }],
    },
    {
      id: randomUUID(),
      name: "Bob's Casual Fits",
      description: null,
      isPublic: false,
      userId: bob!._id,
      itemIds: [straightJeans!._id, whiteShirt!._id],
      sharedWith: [],
    },
  ]);
  console.log("[seed] closets ✓");

  // ── 8. outfits ────────────────────────────────────────────────────────────
  await Outfit.insertMany([
    {
      id: randomUUID(),
      name: "Smart Casual",
      style: "casual",
      createdBy: alice!._id,
      itemIds: [woolJacket!._id, straightJeans!._id, whiteShirt!._id],
      reviews: [
        {
          id: randomUUID(),
          score: 5,
          text: "Love this combination!",
          writtenBy: bob!._id,
        },
        {
          id: randomUUID(),
          score: 4,
          text: "Very clean look.",
          writtenBy: carol!._id,
        },
      ],
    },
    {
      id: randomUUID(),
      name: "Winter Ready",
      style: "winter",
      createdBy: dave!._id,
      itemIds: [woolJacket!._id, leatherBoots!._id],
      reviews: [
        {
          id: randomUUID(),
          score: 5,
          text: "Perfect for Copenhagen winters.",
          writtenBy: alice!._id,
        },
      ],
    },
  ]);
  console.log("[seed] outfits ✓");

  // ── done ──────────────────────────────────────────────────────────────────
  console.log("\n[seed] All collections seeded successfully ✓");
  await closeMongo();
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
