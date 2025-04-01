// routes/userRoutes.js
const express = require('express');
const { getAllRoles } = require('../controllers/Roles');
const router = express.Router();
// GET route to fetch all users

const verifyToken = require('../utils/VerifyToken'); // Import the verifyToken middleware
router.get('/',verifyToken, getAllRoles); // This is the new route to get all roles
module.exports = router;
