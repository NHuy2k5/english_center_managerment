const cron = require('node-cron')
const { Op } = require("sequelize");
const { Session } = require("../models/index");
// Chạy mỗi phút một lần
const startSessionCleanupJob = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const deleted = await Session.destroy({
                where: {
                    expiresAt: {
                        [Op.lte]: new Date() // Xóa nếu expiresAt nhỏ hơn hoặc bằng thời gian hiện tại
                    }
                }
            });
            console.log(`[CRON] Deleted ${deleted} expired sessions`);
        } catch (error) {
            console.error('[CRON] Cleanup error:', error);
        }
    });
}

// Chạy lúc 0:00 mỗi ngày
// cron.schedule(
//     "0 0 * * *",...
module.exports = {
    startSessionCleanupJob
};