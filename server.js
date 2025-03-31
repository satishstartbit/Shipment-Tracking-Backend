const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/AdminuserRoutes"); // Your user routes
const MobileRoutes = require("./routes/MobileUserRoutes");
const companyRoutes = require("./routes/AdmincompanyRoutes"); // Your user routes
const roleRoutes = require("./routes/roleRoutes"); // Your user routes
const ShipmentRoutes = require("./routes/ShipmentRoutes"); // Your user routes



const app = express();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use("/api/role", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/mobile", MobileRoutes)
app.use("/shipment", ShipmentRoutes)

app.get('/', (req, res) => {
    res.send('Hello, World!');
});



app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.statusCode || 500).json({
        message: error.message || "An unexpected error occurred",
        data: error.data || null,
    });
});



mongoose
    .connect(DB_URL)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error("❌ Failed to connect to MongoDB", err);
        process.exit(1);
    });

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Export a handler for Vercel
module.exports = app;