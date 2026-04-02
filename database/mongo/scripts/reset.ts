import "dotenv/config";
import mongoose from "mongoose";
import { connectMongo, disconnectMongo } from "../mongoose-client.js";

async function reset() {
  await connectMongo();
  await mongoose.connection.dropDatabase();
  console.log("[mongo-reset] Database dropped");
  await disconnectMongo();
}

reset().catch((err) => {
  console.error("[mongo-reset] Failed:", err);
  process.exit(1);
});
