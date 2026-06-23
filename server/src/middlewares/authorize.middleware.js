const authorize = (...roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const userRoles = req.user.roles || [];

        const hasRole = userRoles.some(role =>
            roles.includes(role)
        );

        if (!hasRole) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        next();
    };
};

module.exports = authorize;