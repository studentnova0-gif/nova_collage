const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Error:", error));

// Test route
app.get("/", (req, res) => {
  res.send("College Website Backend is Running!");
});

// Student model
const Student = require("./model/Student");

// Submit student application
app.post("/api/applications", async (req, res) => {
  try {
    const student = new Student(req.body);

    await student.save();

    res.status(201).json({
      message: "Application submitted successfully!",
      student: student
    });

  } catch (error) {
    res.status(500).json({
      message: "Error saving application",
      error: error.message
    });
  }
});

// Get all applications
app.get("/api/applications", async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);

  } catch (error) {
    res.status(500).json({
      message: "Error getting applications"
    });
  }
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});