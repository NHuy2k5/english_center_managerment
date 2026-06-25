const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const generateAccessToken = (user) => {

    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.ACCESS_SECRET,
        {
            expiresIn: "7d"
        }
    );

};
const generateRefreshToken = (user) => {

    return jwt.sign(
        {
            id: user.id
        },
        process.env.REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    );

};



module.exports = {
    generateAccessToken,
    generateRefreshToken
};