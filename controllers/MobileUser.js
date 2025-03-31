const Users = require('../models/user');
const Session = require('../models/session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Roles = require("../models/role")

// Controller to get all roles
const UserLogin = async (req, res, next) => {
    const { emailOrUsername, password, deviceInfo } = req.body;

    try {
        // Find the user by email or username
        const user = await Users.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        // Check if password is correct
        const isPasswordValid = password === user.password
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        // Generate JWT token (expires in 1 hour)
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store the session with device info
        const newSession = new Session({
            userId: user._id,
            deviceInfo: {
                deviceId: deviceInfo.deviceId,
                deviceType: deviceInfo.deviceType,
                ip: req.ip, // You can use a package like 'request-ip' to get the user's IP
            },
        });
        await newSession.save();




        const roles = await Roles.findById(user?.roleid); // Fetch all roles        


        // Send the response back
        res.status(200).json({ accessToken, user, roles });
    } catch (error) {
        console.log("sdcv");

        next(error); // Handle error if fetching roles fails
    }
};



const UserLogout = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find the latest session and mark as logged out
        const session = await Session.findOne({ userId }).sort({ loginAt: -1 }).limit(1);
        if (session) {
            await Session.updateOne({ _id: session._id }, { logoutAt: new Date() });
        }

        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = { UserLogin, UserLogout };

