const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const authMiddleware = {
    verifyAdminUser: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.admin = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    },

    // Helper method to generate admin access token
    generateAccessToken(admin) {
        return jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
    },

    generateRefreshToken(admin) {
        return jwt.sign({ id: admin.id, username: admin.username }, REFRESH_SECRET, { expiresIn: '2d' });
    },

    verifyRefreshToken(token) {
        if (!token) {
            throw new Error('No token provided');
        }
        
        return jwt.verify(token, REFRESH_SECRET);
    }
};

module.exports = authMiddleware; 