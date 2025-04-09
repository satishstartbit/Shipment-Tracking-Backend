// Core modules and third-party packages

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors")
require("dotenv").config();

const admin = require("firebase-admin");

// Importing route modules
const userRoutes = require("./routes/AdminuserRoutes"); // Your user routes
const MobileRoutes = require("./routes/MobileUserRoutes");
const companyRoutes = require("./routes/AdmincompanyRoutes"); // Your user routes
const roleRoutes = require("./routes/roleRoutes"); // Your user routes
const ShipmentRoutes = require("./routes/ShipmentRoutes"); // Your user routes

const verifyToken = require('./utils/VerifyToken'); // Import the verifyToken middleware

// Initialize the Express app
const app = express();


// Middleware setup
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded payloads
app.use(bodyParser.json()); // Parse JSON payloads

// Enable CORS for all origins
app.use(cors({
    origin: "*"
}))

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL;



// Set CORS headers for all responses
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});



// Initialize Firebase Admin SDK with your service account key
admin.initializeApp({
    credential: admin.credential.cert(
        require("./serviceAccountKey.json")
    ),
});







// API route definitions
app.use("/api/role", verifyToken, roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/company", verifyToken, companyRoutes);
app.use("/mobile", MobileRoutes)
app.use("/shipment", verifyToken, ShipmentRoutes)

app.get('/', (req, res) => {
    res.send('Hello, World!');
});


// Global error handling middleware
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.statusCode || 500).json({
        message: error.message || "An unexpected error occurred",
        data: error.data || null,
    });
});

// Database connection

mongoose
    .connect(DB_URL)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error("❌ Failed to connect to MongoDB", err);
        process.exit(1);
    });

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Export a handler for Vercel
module.exports = app;