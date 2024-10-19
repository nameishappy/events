import express from "express";
import dotenv from "dotenv";
import { connectToDb } from "./db.js";
import { cert, initializeApp } from "firebase-admin/app";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import cors from "cors";
import { createEventRoutes } from "./routes/events.js";

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Add middleware
app.use(cors());
app.use(express.json());

// Get service account file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serviceAccountPath = join(__dirname, "serviceAccount.json"); // Make sure this matches your file name exactly

// Initialize Firebase Admin
try {
  const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
  );

  initializeApp({
    credential: cert(serviceAccount),
  });

  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
  process.exit(1);
}
const connection = await connectToDb();
// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/events", createEventRoutes(connection));

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 3000;

try {
  //   await connectToDb();
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
