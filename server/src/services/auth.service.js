const { Session, UserRole, Role, User } = require('../models/index');
const jwt = require('jsonwebtoken');
const { comparePassword } = require("../utilities/hashing");
const dayjs = require('dayjs')
const { Op } = require('sequelize')
const { generateAccessToken, generateRefreshToken } = require('../utilities/jwt');
const login = async (identifier, password) => {
    const user = await User.findOne({
        where: {
            [Op.or]: [
                { email: identifier },
                { user_name: identifier },
                { phone: identifier }
            ]
        },
        paranoid: false
    });
    console.log('user found:', user?.id, user?.phone, user?.deleted_at);
    if (!user) {
        throw Error('Invalid credentials');
    }

    const userRole = await UserRole.findOne({
        where: { user_id: user.id },
        include: [{
            model: Role,
            attributes: ['name']
        }]
    });
    
    const checkPassword = await comparePassword(password, user.password);
    if (!checkPassword) {
        throw new Error("Wrong password");
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    // lưu refresh token DB
    await Session.create({
        user_id: user.id,
        refresh_token: refreshToken,
        expire_at: dayjs().add(7, "day").toDate()
    });
    return {
        user: {
            id: user.id,
            user_name: user.user_name,
            email: user.email,
            phone: user.phone,
            role: userRole?.Role?.name || null,
        },
        access_token: accessToken,
        refresh_token: refreshToken
    };
}
const refreshToken = async (refreshtoken) => {
    const session = await Session.findOne({
        where: {
            refresh_token: refreshtoken
        }
    });
    if (!session) {
        throw new Error("Session not found");
    }
    if (session.expire_at < new Date()) {
        await session.destroy();
        throw new Error(
            "Refresh token expired"
        );
    }
    const payload = jwt.verify(
        refreshtoken,
        process.env.REFRESH_SECRET
    );
    const user = await User.findByPk(
        payload.id
    );
    const accessToken =
        generateAccessToken(user);
    return {
        accessToken
    };
};
const logout = async (refreshToken) => {
    await Session.destroy({
        where: {
            refresh_token: refreshToken
        }
    });
}
module.exports = {
    login, refreshToken, logout
};