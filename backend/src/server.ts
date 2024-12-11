import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";

import authMiddleware from "./middleware/authMiddleware";
import authRoutes from "./routes/authRoutes";
import toDoRoutes from "./routes/toDoRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Core Routes
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.send("Backend is running!");
});

// Debugging route
app.get("/api/debug/protected", authMiddleware, (req, res) => {
  res.json({
    message: "This is a protected route!",
    user: (req as any).user,
  });
});

app.use("/api", toDoRoutes);

// Database connection function
export const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing!");
  }

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
  console.log("Connected to MongoDB");
};

// App initialization
export const initializeApp = () => app;

export default app;
