import "dotenv/config";
import { User } from "../models/User.js";
import { connectMongo, closeMongo } from "../mongoose-client.js";

const SEED_DATA = [
  {
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Smith",
    role: "admin",
  },
  {
    email: "bob@example.com",
    firstName: "Bob",
    lastName: "Johnson",
    role: "user",
  },
  {
    email: "carol@example.com",
    firstName: "Carol",
    lastName: "Williams",
    role: "user",
  },
  {
    email: "dave@example.com",
    firstName: "Dave",
    lastName: "Brown",
    role: "moderator",
  },
];

async function seed() {
  await connectMongo();

  const count = await User.countDocuments();

  if (count > 0) {
    console.log(`[mongo-seed] Already has ${count} users. Skipping.`);
    await closeMongo();
    return;
  }

  await User.insertMany(SEED_DATA);
  console.log(`[mongo-seed] Seeded ${SEED_DATA.length} users`);

  await closeMongo();
}

seed().catch((err) => {
  console.error("[mongo-seed] Failed:", err);
  process.exit(1);
});
