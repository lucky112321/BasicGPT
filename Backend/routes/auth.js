import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    console.log("Register route hit with body:", req.body);

    const { username, email, password } = req.body;

    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            console.log("Email exists:", email);
            return res.status(400).json({ message: "Email already in use" });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            console.log("username exists:", username);
            return res.status(400).json({ message: "Username already in use" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        await newUser.save();
        console.log("user saved successfully");
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during registration:", error);
        const errorMessage = error.message || "Unknown error occurred";
        const errorStack = error.stack || "NO  stack trace";
        res.status(500).json({
            message: `server Error: ${errorMessage}`,
            details: JSON.stringify(error, Object.getOwnPropertyNames(error))
        });
    }
});

router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Something went Wrong" })
    }

});

export default router;