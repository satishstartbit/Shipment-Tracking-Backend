// routes/userRoutes.js
const express = require('express');
const { registerUser, getUserById, getAllUsers, getAllRoles } = require('../controllers/CreateUsers');

const router = express.Router();
// POST route to register a new user
router.post('/register', registerUser);
// GET route to get user details by ID
router.get('/:id', getUserById);

// GET route to fetch all users
router.get('/', getAllUsers); // This is the new route to get all users
module.exports = router;
