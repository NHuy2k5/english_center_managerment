const { getSchedules } = require("../services/schedule.service");

const getSchedulesController = async (req, res) => {
    try {
        const userID = Number(req.user.id);
        const {status, ...result} = await getSchedules(userID);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {getSchedulesController};