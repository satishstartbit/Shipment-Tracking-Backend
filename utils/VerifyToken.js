const jwt = require('jsonwebtoken');

// Secret key used to sign the JWT token (it should be stored securely, e.g., in environment variables)
const JWT_SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; // replace with your actual secret key

// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY); // Verify token
        req.user = decoded; // Attach decoded data (user information) to the request object
        next(); // Proceed to the next middleware or controller
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = verifyToken;
