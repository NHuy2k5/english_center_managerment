const { getStudent } = require('../services/student.service');
const { getTeacher } = require('../services/teacher.service');
const { getParent } = require('../services/parent.service');
const { login, logout, refreshToken } = require('../services/auth.service');
const { getAdmin } = require('../services/admin.service');
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
            res.status(400).json({
                message: error.message
            })
        }
    },
    getMe: async (req, res) => {
        try {
            const { role, id } = req.user;
            let profileResult = null;

            if (role === 'student') {
                profileResult = await getStudent(id);
            } else if (role === 'teacher') {
                profileResult = await getTeacher(id);
            } else if (role === 'parent') {
                profileResult = await getParent(id);
            } else if (role === 'admin') {
                profileResult = await getAdmin(id);
            }
            return res.status(200).json({
                data: {
                    user: req.user,
                    profile: profileResult?.data || null
                }
            });

        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}