const express = require('express');
const { registerUser, getUserById, getAllUsers, deleteUserById } = require('../../controllers/webportal/user/CreateUsers');
const { loginUser, refreshAccessToken } = require('../../controllers/webportal/user/authController');

const router = express.Router();

// POST route to register a new user
router.post('/registeruser', registerUser);

// GET route to get user details by ID
router.get('/:id', getUserById);



// Delete route to get user details by ID
router.get('/delete/:id', deleteUserById);

// POST route to login a user and get access & refresh tokens
router.post('/login', loginUser);

// POST route to refresh the access token using the refresh token
router.post('/refresh', refreshAccessToken);

// GET route to fetch all users
router.get('/', getAllUsers);

module.exports = router;
