const cron = require('node-cron');
const dayjs = require('dayjs');
const { generateMonthlyTeacherSalary } = require('../services/monthlysalary.service');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
const TZ = 'Asia/Ho_Chi_Minh';
const startGenerateSalaryJob = () => {
    // Chạy vào 00:00 ngày 1 hàng tháng
    // ┌─ giây (optional)
    // │ ┌─ phút
    // │ │ ┌─ giờ
    // │ │ │ ┌─ ngày trong tháng
    // │ │ │ │ ┌─ tháng
    // │ │ │ │ │ ┌─ ngày trong tuần
    // │ │ │ │ │ │
    // 0  0  0  1  *  *
    cron.schedule('* * * * *', async () => {
        try {
            // Lấy tháng vừa kết thúc
            const lastMonth = dayjs().tz(TZ); // Dùng để test 
            // const lastMonth = dayjs().subtract(1, 'month'); --- Trong production
            const month = lastMonth.month() + 1;
            const year = lastMonth.year();

            console.log(`[SalaryJob] Generating salary for ${month}/${year}...`);

            const result = await generateMonthlyTeacherSalary({
                teacherIds: [], // [] = tất cả giáo viên
                month,
                year
            });

            console.log(`[SalaryJob] Done. Generated ${result.length} records.`);

        } catch (err) {
            console.error('[SalaryJob] Error:', err.message);
        }
    });
}
module.exports = {startGenerateSalaryJob}