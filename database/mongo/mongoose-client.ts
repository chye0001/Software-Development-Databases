import "dotenv/config";
import mongoose from "mongoose";

const URI = process.env.MONGO_DB_URI!;
const DB_NAME = process.env.MONGO_DB!;

if (!URI) throw new Error("MONGO_DB_URI is not defined");
if (!DB_NAME) throw new Error("MONGO_DB is not defined");

export async function connectMongo(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    console.log("[mongoose] Already connected");
    return;
  }

  await mongoose.connect(URI, { dbName: DB_NAME });
  console.log(`[mongoose] Connected to ${DB_NAME}`);
}

export async function closeMongo(): Promise<void> {
  await mongoose.disconnect();
  console.log("[mongoose] Disconnected");
}
