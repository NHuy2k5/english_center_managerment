const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

const optionalAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            // Không có token → guest, vẫn cho đi tiếp
            req.user = null;
            return next();
        }

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, process.env.ACCESS_SECRET);
        const user = await User.findByPk(payload.id);

        req.user = user || null;
        next();

    } catch (err) {
        // Token lỗi hoặc hết hạn → coi như guest
        req.user = null;
        next();
    }
};

module.exports = optionalAuthenticate;