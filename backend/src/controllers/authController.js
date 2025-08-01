const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../middleware/authMiddleware');
const Admin = require('../model/AdminModel');
const bcrypt = require('bcrypt');

const authController = {

    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password ) {
                return res.status(401).json({ message: 'All fields required' });
            }

            const admin = await Admin.findOne({ where: { username }});

            if (admin) {
                const isValidPassword = await bcrypt.compare(password, admin.password);
                if (!isValidPassword) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                const accessToken = generateAccessToken(admin);
                const refreshToken = generateRefreshToken(admin);

                admin.refresh_token = refreshToken;
                await admin.save();

                res.json({
                    accessToken,
                    refreshToken,
                    username: admin.username,
                    id: admin.id
                });
            } else {
                return res.status(404).json({ message: 'There is no admin using this username' });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }, 

    async renewToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token required' });
            }

            const isTokenCorrect = verifyRefreshToken(refreshToken);

            if (isTokenCorrect) {
                const admin = await Admin.findOne({ where: { refresh_token: refreshToken } });

                if (!admin) {
                    return res.status(401).json({ message: "Can't renew token. Login again" });
                }

                const accessToken = generateAccessToken(admin);
                const newRefreshToken = generateRefreshToken(admin);

                res.json({
                    accessToken,
                    refreshToken: newRefreshToken
                });
            } else {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }
        } catch (error) {
            console.error('Refresh token error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async logout(req, res) {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(401).json({ message: 'ID required' });
            }

            const admin = await Admin.findByPk(id);

            admin.refresh_token = null;
            await admin.save();

            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(401).json({message: "required all fields."});
            }

            const admin = await Admin.create({
                username,
                email,
                password
            });

            res.status(200).json({ success: true, message: "Admin Register Successfully", data: admin });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = authController;