
const Users = require('../models/user');
// Controller to register a new user
const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new Users({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        next(error); // Passing the error to the error handling middleware
    }
};

// Controller to get user details by ID
const getUserById = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

// Controller to get all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await Users.find(); // Fetch all users        
        res.status(200).json({ users }); // Respond with the list of users
    } catch (error) {
        next(error); // Handle error if fetching users fails
    }
};



module.exports = { registerUser, getUserById, getAllUsers  };
