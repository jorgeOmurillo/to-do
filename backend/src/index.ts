import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authMiddleware from "./middleware/authMiddleware";
import mongoose, { ConnectOptions } from "mongoose";

import authRoutes from "./routes/authRoutes";
import toDoRoutes from "./routes/toDoRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Core Routes
app.get("/health", (req, res) => {
  res.send("Backend is running!");
});

app.use("/api/auth", authRoutes);

// Debugging route
app.get("/api/debug/protected", authMiddleware, (req, res) => {
  res.json({
    message: "This is a protected route!",
    user: (req as any).user,
  });
});

app.use("/api", toDoRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Start the database
const startServer = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is missing!");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

startServer();
