const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    username: document.querySelector('#username').value,
    email: document.querySelector('#email').value
  };

  try {
    const response = await fetch('http://localhost:5001/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    console.log('Saved to Database:', result);
    alert('Data submitted successfully!');
  } catch (error) {
    console.error('Submission error:', error);
  }
});
async function loadUsers() {
  try {
    const response = await fetch('http://localhost:5001/api/users');
    const users = await response.json();
    
    // Render to page
    const userList = document.getElementById('user-list');
    userList.innerHTML = users.map(user => `<li>${user.username} - ${user.email}</li>`).join('');
  } catch (error) {
    console.error('Failed to load users:', error);
  }
}

// Call on page load
loadUsers();
const { MongoClient } = require("mongodb");

const url = "YOUR_MONGODB_CONNECTION_STRING";

const client = new MongoClient(url);

async function main() {
    try {
        await client.connect();

        console.log("MongoDB connected successfully!");

        const db = client.db("nova_college");

        const students = db.collection("students");

        console.log("Database: nova_college");
        console.log("Collection: students");

    } catch (error) {
        console.error(error);
    }

const mongoose = require('mongoose');

// Paste the connection string INSIDE QUOTES here:
const mongoURI = "mongodb+srv://studentnova0_db_user:k4Ke0AIzhgxdbZlm@cluster0.inygqnd.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log("Connected to Cluster0 successfully!"))
  .catch((err) => console.error("Database connection error:", err));
 const cors = require('cors');
app.use(cors()); // Place this near the top, before your routes
async function getData() {
  const response = await fetch('http://localhost:5001/api/your-route-name');
  const data = await response.json();
  console.log('Data from MongoDB:', data);
}
 async function sendData(userData) {
  const response = await fetch('http://localhost:5001/api/your-route-name', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const result = await response.json();
  console.log('Saved to MongoDB:', result);
}
 
 const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());          // Allows your front-end to connect
app.use(express.json());  // Allows server to read JSON sent from front-end

// 1. GET Route - Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: "Hello! Your backend and MongoDB are ready." });
});

// 2. POST Route - Example to save data
app.post('/api/data', async (req, res) => {
  console.log("Data received from front-end:", req.body);
  // Here you can save req.body using your Mongoose model
  res.json({ success: true, message: "Data received successfully!" });
});
async function testConnection() {
  try {
    const response = await fetch('http://localhost:5001/api/test');
    const data = await response.json();
    console.log("Server response:", data.message);
  } catch (error) {
    console.error("Error connecting to server:", error);
  }
}

testConnection();
async function sendFormData(formData) {
  try {
    const response = await fetch('http://localhost:5001/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    console.log("Saved:", result);
  } catch (error) {
    console.error("Error sending data:", error);
  }
}
 // Fetch data from your backend
fetch('http://localhost:5001/api/your-endpoint-name')
  .then(response => response.json())
  .then(data => console.log('Data from MongoDB:', data))
  .catch(error => console.error('Error:', error));
  // =================================
// NOVA COLLEGE ADVERTISEMENT
// =================================

window.addEventListener("load", function () {

    setTimeout(function () {

        document
            .getElementById("ad-popup")
            .classList.add("show");

    }, 78000);

});


function closeAd() {

    document
        .getElementById("ad-popup")
        .classList.remove("show");
4000
}

// ======================================
// NOVA COLLEGE SCROLL ANIMATION
// ======================================

const animatedElements = document.querySelectorAll(".animate");

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }

        });

    },
    {
        threshold: 0.15
    }
);

animatedElements.forEach((element) => {
    observer.observe(element);
});


alert("Welcome to Nova Colllage")
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;
const FILE = "students.json";

// Test backend
app.get("/", (req, res) => {
    res.send("Nova College Backend is Running!");
});

// Save admission
app.post("/admission", (req, res) => {

    const student = req.body;

    fs.readFile(FILE, "utf8", (err, data) => {

        let students = [];

        if (!err && data) {
            students = JSON.parse(data);
        }

        students.push({
            id: Date.now(),
            name: student.name,
            fatherName: student.fatherName,
            phone: student.phone,
            program: student.program
        });

        fs.writeFile(
            FILE,
            JSON.stringify(students, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Could not save student"
                    });
                }

                res.json({
                    message: "Admission saved successfully!"
                });
            }
        );
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
document.getElementById("admissionForm").addEventListener("submit", async function(e) {

    e.preventDefault();
    const student = {
        name: document.getElementById("name").value,
        fatherName: document.getElementById("fatherName").value,
        phone: document.getElementById("phone").value,
        program: document.getElementById("program").value
    };

    const response = await fetch("http://localhost:3000/admission", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(student)
    });

    const result = await response.json();

    alert(result.message);

});
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("YOUR_MONGODB_CONNECTION_STRING")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  program: String,
  age: Number
});

const Student = mongoose.model("Student", studentSchema);

app.post("/students", async (req, res) => {
  const student = new Student(req.body);
  await student.save();

  res.json({
    message: "Student saved successfully",
    student
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
}
function playAnimation() {
  const tl = gsap.timeline();

  // Reset elements
  tl.set(".vector-dot, .node, .path-line, #chat", { opacity: 0, scale: 0 })
    .set(".chat-bubble", { y: 20, scale: 1 });

  // Sequential Animation Steps
  tl.to(".vector-dot", {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    stagger: 0.15,
    ease: "back.out(1.7)"
  })
  .to("#line1", {
    opacity: 0.6,
    duration: 0.4
  }, "-=0.2")
  .to("#node1", {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: "back.out(1.5)"
  })
  .to("#node2", {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: "back.out(1.5)"
  }, "-=0.3")
  .to("#line2", {
    opacity: 0.6,
    duration: 0.4
  }, "-=0.2")
  .to("#chat", {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power3.out"
  });
}

// Start animation on load
window.addEventListener("DOMContentLoaded", playAnimation);