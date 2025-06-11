import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";

const router = express.Router();

// Registration route (already present)
router.post("/register", async (req, res) => {
  try {
    const userCollection = User();
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Check if user already exists
    const existing = await userCollection.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await userCollection.insertOne({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Public user login route with session
router.post("/login", async (req, res) => {
  try {
    const userCollection = User();
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await userCollection.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // Set session
    req.session.userId = user._id;
    req.session.userEmail = user.email;

    res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Example: Route to check if user is authenticated
router.get("/check", (req, res) => {
  if (req.session.userId) {
    res.json({ authenticated: true, email: req.session.userEmail });
  } else {
    res.json({ authenticated: false });
  }
});

// Example: Logout route
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

export default router;