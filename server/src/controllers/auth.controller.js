const { login, logout, refreshToken } = require('../services/auth.service')
module.exports = {
    logIn: async (req, res) => {
        try {
            const {
                identifier,
                password
            } = req.body;
            const data =
                await login(
                    identifier,
                    password
                );
            res.json(data);
        } catch (err) {
            res.status(400)
                .json({
                    message: err.message
                });
        }
    },
    logOut: async (req, res) => {
        const { refresh_token } =
            req.body;
        await logout(
            refresh_token
        );
        res.json({
            message:
                "Logout success"
        });
    },
    refresh: async (req, res) => {
        try {
            const { refresh_token } =
                req.body;
            const data =
                await refreshToken(refresh_token);
            res.json(data);
        } catch (error) {
            res.json(400).json({
                message: error.message
            })
        }
    }
}