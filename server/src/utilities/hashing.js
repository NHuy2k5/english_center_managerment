const bycript = require('bcrypt');
module.exports = {
    hashPassword: (password) => {
        const saltRound = 10;
        return bycript.hashSync(password, saltRound);
    },
    comparePassword: async (password, passwordCompare) => {
        return await bcrypt.compare(password,passwordCompare);
    }
}