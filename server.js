const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/webportal/userRoutes"); // Your user routes
const roleRoutes = require("./routes/webportal/roleRoutes"); // Your user routes
const companyRoutes = require("./routes/webportal/companyRoutes"); // Your user routes

const MobileRoutes = require("./routes/nativeapp/userRoutes");



const app = express();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL;



mongoose
    .connect(DB_URL)
    .then(() => {
        console.error("success", err);
    })
    .catch((err) => {
        console.error("❌ Failed to connect to MongoDB", err);
    });


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

app.use("/api/users", userRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/company", companyRoutes);


app.use("/mobile", MobileRoutes)


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/api/data', (req, res) => {
    res.json({ message: "This is a sample API response" });
});


app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.statusCode || 500).json({
        message: error.message || "An unexpected error occurred",
        data: error.data || null,
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


