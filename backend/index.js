import express from "express";
import dotenv from "dotenv";
import { connectToDb } from "./db.js";
import { cert, initializeApp } from "firebase-admin/app";
import cors from "cors";
import { createEventRoutes } from "./routes/events.js";

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Add middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin using environment variable for credentials
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS); // Store the service account in a Railway environment variable

  initializeApp({
    credential: cert(serviceAccount),
  });

  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
  process.exit(1);
}

// Database connection
let connection;
try {
  connection = await connectToDb();
  console.log("Database connected successfully");
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Event routes
app.use("/api/events", createEventRoutes(connection));

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
