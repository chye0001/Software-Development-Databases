import "dotenv/config";
import { Neogma } from "neogma";

// TODO - add test env config to .env and config object if we decide to test this as exam project 
type Environment = "dev" | "prod";

const ENV = (process.env.NODE_ENV ?? "dev") as Environment;

const config: Record<Environment, {
  url: string | undefined;
  username: string | undefined;
  password: string | undefined;
  database: string | undefined;
  encrypted: boolean;
}> = {
  dev: {
    url:      process.env.NEO4J_URL_DEV,
    username: process.env.NEO4J_USERNAME_DEV,
    password: process.env.NEO4J_PASSWORD_DEV,
    database: process.env.NEO4J_DB_DEV,
    encrypted: false
  },
  //   // TODO implment test section if we decide to test this as exam project
  // test: {
  //   url:      "neo4j://localhost:7688",  // separate port so tests don"t hit dev DB
  //   username: "neo4j",
  //   password: "password",
  //   database: "neo4j-test",
  //   encrypted: false
  // },
  prod: {
    url:      process.env.NEO4J_URL_PROD,
    username: process.env.NEO4J_USERNAME_PROD,
    password: process.env.NEO4J_PASSWORD_PROD,
    database: process.env.NEO4J_DATABASE_PROD,
    encrypted: true
  },
};


const { url, username, password, database } = config[ENV];
if (!url || !username || !password || !database) {
  throw new Error(`Missing required Neo4j env vars for environment: ${ENV}`);
}
const { encrypted, ...connectionConfig } = config[ENV];


export const neogma = new Neogma(
  //@ts-ignore
  connectionConfig, {
    logger: console,   // ← uncomment to log every Cypher query
    encrypted: encrypted ? "ENCRYPTION_ON" : "ENCRYPTION_OFF",
  }
);


let isConnected = false;
export async function connectNeo4j(): Promise<void> {
  if (isConnected) {
    console.warn("Neo4j is already connected. Skipping redundant connectNeo4j() call.");
    return;
  }

  try {
    await neogma.verifyConnectivity();
    isConnected = true;
    console.log("Neo4j connected via Neogma for environment:", ENV);
    
  } catch (error) {
    console.error("Failed to connect to Neo4j:", error);
  }
}

export async function disconnectNeo4j(): Promise<void> {
  try {    
    await neogma.driver.close();
    isConnected = false;
    console.log("Neo4j connection closed");

  } catch (error) {
    console.error("Failed to disconnect Neo4j:", error);
  }
}