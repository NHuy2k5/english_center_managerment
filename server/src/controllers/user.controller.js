const { getUsers } = require("../services/user.service");
const { successResponse } = require("../utilities/response");

module.exports = {
    index: async (req, res) =>  {
        const users = await getUsers();
        return res.json(users);
    }
};