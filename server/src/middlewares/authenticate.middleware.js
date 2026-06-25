const jwt = require("jsonwebtoken");
const { User, UserRole, Role } = require("../models/index");
const dotenv = require('dotenv');
dotenv.config()
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const token = authHeader.split(" ")[1];

        const payload = jwt.verify(
            token,
            process.env.ACCESS_SECRET
        );

        const user = await User.findByPk(payload.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }
        const userRole = await UserRole.findOne({
            where: { user_id: user.id },
            include: [{
                model: Role,
                attributes: ['name']
            }]
        });
        const userData = user.toJSON();
        req.user = {
            ...userData,
            role: userRole?.Role?.name || null
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate;