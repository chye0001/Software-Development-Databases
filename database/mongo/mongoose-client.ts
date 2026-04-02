import "dotenv/config";
import mongoose from "mongoose";

const env = process.env.NODE_ENV ?? "dev";
if (!["dev", "test", "prod"].includes(env)) {
  throw new Error(`Invalid NODE_ENV value: ${env}. Expected "dev", "test", or "prod".`);
}

const URI = process.env[`MONGO_DB_URI_${env.toUpperCase()}`];
const DB_NAME = process.env[`MONGO_DB_${env.toUpperCase()}`];

if (!URI) throw new Error(`MONGO_DB_URI_${env.toUpperCase()} is not defined`);
if (!DB_NAME) throw new Error(`MONGO_DB_${env.toUpperCase()} is not defined`);

export async function connectMongo(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    console.log("[mongoose] Already connected");
    return;
  }

  try {
    await mongoose.connect(URI as string, { dbName: DB_NAME as string });
    console.log(`[mongoose] Connected to ${DB_NAME}`);

  } catch (error) {
    console.error("[mongoose] Connection error:", error);
  }
}

export async function disconnectMongo(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("[mongoose] Disconnected");
    
  } catch (error) {
    console.error("[mongoose] Disconnection error:", error);
  }
}
