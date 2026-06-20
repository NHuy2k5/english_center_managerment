const corn = require('node-cron')
// Chạy mỗi phút một lần
cron.schedule('* * * * *', async () => {
  try {
    await Session.destroy({
      where: {
        expiresAt: {
          [Op.lte]: new Date() // Xóa nếu expiresAt nhỏ hơn hoặc bằng thời gian hiện tại
        }
      }
    });
    console.log('Đã dọn dẹp các session hết hạn thành công.');
  } catch (error) {
    console.error('Lỗi khi xóa session hết hạn:', error);
  }
});