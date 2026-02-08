import "dotenv/config"
import { prisma } from "../prisma-client.js"

async function seed() {
    const bob = await prisma.user.create({
        data: {
            email: "bob@example.com",
            name: "Bob"
        }
    });

    const alice = await prisma.user.create({
        data: {
            email: "alice@example.com",
            name: "Alice"
        }
    });

    console.log("Database seeded with users:", {bob, alice});
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })