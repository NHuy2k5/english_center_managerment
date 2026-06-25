const { getMonthlyTeacherSalaries, payTeacherSalary} = require("../services/monthlysalary.service");
const { getTeachers } = require("../services/teacher.service");
const { Op } = require('sequelize');
const { MonthlyTeacherSalary } = require('../models/index');
const dayjs = require('dayjs');
/*
    Query: ?teacher_id=1&the_first_of_the_month=2026-06-01&is_teacher_paid=false
           &_sort=the_first_of_the_month&_order=desc&_page=1&_limit=10
*/
const getSalariesController = async (req, res) => {
    try {
        const userRoles = req.user.roles || [];
        const salaryQuery = req.queryOptions.monthlyTeacherSalary;

        // Nếu là teacher thì chỉ xem được của mình
        // Dù có truyền ?teacher_id khác cũng bị ghi đè
        if (userRoles.includes('teacher')) {
            salaryQuery.where.teacher_id = req.user.id;
        }

        const result = await getMonthlyTeacherSalaries({
            month: null,
            year: null,
            teacherIds: null,
            // Truyền thẳng queryOptions vào service để dùng where/order/limit
            _queryOptions: salaryQuery,
            _pagination: {
                limit: req.queryOptions.limit,
                offset: req.queryOptions.offset
            }
        });

        if (result.status === 404) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({
            data: result.data,
            message: result.message
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// POST /salaries/pay
/*
    req.body:
    {
        "teacher_ids": [1, 2, 3],
        "months": [
            { "month": 6, "year": 2026 },
            { "month": 7, "year": 2026 }
        ]
    }
*/
const paySalaryMultipleController = async (req, res) => {
    try {
        const { teacher_ids, months } = req.body;

        // Validate
        if (!teacher_ids?.length || !months?.length) {
            return res.status(400).json({
                message: 'teacher_ids, months are required'
            });
        }

        const isValidMonths = months.every(
            m => m.month >= 1 && m.month <= 12 && m.year > 0
        );
        if (!isValidMonths) {
            return res.status(400).json({
                message: 'months must have valid month (1-12) and year'
            });
        }

        // Tìm tất cả salary_ids theo teacher_ids và months
        const startDates = months.map(({ month, year }) =>
            dayjs().year(year).month(month - 1).startOf('month').format('YYYY-MM-DD')
        );

        const salaryRecords = await MonthlyTeacherSalary.findAll({
            where: {
                teacher_id: { [Op.in]: teacher_ids },
                the_first_of_the_month: { [Op.in]: startDates },
                is_teacher_paid: false
            },
            attributes: ['id']
        });

        if (!salaryRecords.length) {
            return res.status(404).json({
                message: 'No unpaid salary records found'
            });
        }

        const salaryIds = salaryRecords.map(s => s.id);

        const result = await payTeacherSalary(salaryIds);

        return res.status(result.status).json({
            data: result.data,
            message: result.message
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
module.exports = {getSalariesController, paySalaryMultipleController}