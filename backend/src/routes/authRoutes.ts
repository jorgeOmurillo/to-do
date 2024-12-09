import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";

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

    // Generate a JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User logged-in successfully!", token });
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

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User registered successfully!", token });
  } catch (error) {
    res.status(400).json({ message: "Error registering user", error });
  }
});

export default router;
