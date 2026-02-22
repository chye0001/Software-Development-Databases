import express from "express";
import { prisma } from "./database/prisma-client.js";

const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.get("/healthcheck", (req, res) => {
  res.status(200).send("OK");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});
