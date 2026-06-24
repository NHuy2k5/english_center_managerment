const authorize = (...roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const userRole = req.user.role??'';

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        next();
    };
};

module.exports = authorize;