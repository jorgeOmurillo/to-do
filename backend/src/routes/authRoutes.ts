import express from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "../models/User";

interface CustomJwtPayload extends JwtPayload {
  _id: string;
}

const router = express.Router();

// Login endpoint
router.post("/login", async (req: any, res: any) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User logged-in successfully!",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Registration endpoint
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const accessToken = jwt.sign(
      { _id: newUser._id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { _id: newUser._id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully!",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(400).json({ message: "Error registering user", error });
  }
});

// Refresh Token Endpoint
router.post("/refresh-token", async (req: any, res: any) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as CustomJwtPayload;
    const accessToken = jwt.sign(
      { _id: decoded._id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(400).json({ message: "Invalid or expired refresh token" });
  }
});

export default router;
