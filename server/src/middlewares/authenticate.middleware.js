const jwt = require("jsonwebtoken");
const { User, UserRole, Role } = require("../models/index");

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
            process.env.JWT_SECRET
        );

        const user = await User.findByPk(payload.id, {
            include: {
                model: UserRole,
                required: true,
                attributes: ['role_id'],
                include: [{
                    model: Role,
                    required: true,
                    attributes: ['name'],
                }]
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = {
            id: user.id,
            role: user.UserRole.Role.name
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