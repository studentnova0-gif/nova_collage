const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Student model
const Student = require("./models/student");

const app = express();

// ========================================
// SETTINGS
// ========================================

const PORT = 5000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
// ========================================
// CHECK MONGODB CONNECTION STRING
// ========================================

if (!process.env.MONGO_URI) {
    console.error("ERROR: MONGO_URI is missing from your .env file.");
    process.exit(1);
}

if (
    !process.env.MONGO_URI.startsWith("mongodb://") &&
    !process.env.MONGO_URI.startsWith("mongodb+srv://")
) {
    console.error("ERROR: MONGO_URI must start with mongodb:// or mongodb+srv://");
    process.exit(1);
}

// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// ========================================
// TEST API
// ========================================

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend and MongoDB are working!"
    });
});

// ========================================
// STUDENT REGISTRATION
// ========================================

app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });
        }

        // Clean input
        const cleanName = String(name).trim();
        const cleanEmail = String(email).toLowerCase().trim();
        const cleanPassword = String(password);

        // Check password length
        if (cleanPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });
        }

        // Check if student already exists
        const existingStudent = await Student.findOne({
            email: cleanEmail
        });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: "This email is already registered."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(cleanPassword, 10);

        // Create student
        const student = new Student({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword
        });

        // Save student
        await student.save();

        return res.status(201).json({
            success: true,
            message: "Student registered successfully!"
        });

    } catch (error) {
        console.error("Registration Error:", error);

        return res.status(500).json({
            success: false,
            message: "Registration failed.",
            error: error.message
        });
    }
});

// ========================================
// STUDENT LOGIN
// ========================================

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter email and password."
            });
        }

        // Clean email
        const cleanEmail = String(email).toLowerCase().trim();

        // Find student
        const student = await Student.findOne({
            email: cleanEmail
        });

        if (!student) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            String(password),
            student.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Login successful
        return res.status(200).json({
            success: true,
            message: "Login successful!",
            student: {
                id: student._id,
                name: student.name,
                email: student.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed.",
            error: error.message
        });
    }
});

// ========================================
// CONNECT TO MONGODB THEN START SERVER
// ========================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Error:");
        console.error(error.message);
        process.exit(1);
    });