const {Role} = require("../models/index");

module.exports = {
    getUsers: async () => {
        const roles = await Role.findAll({attributes: ['name']});
        console.log(roles);
        return roles;
    }
}