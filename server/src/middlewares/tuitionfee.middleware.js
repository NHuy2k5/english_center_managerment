// middlewares/tuitionfee.middleware.js
const { Op } = require('sequelize');
const { Student, TuitionFee } = require('../models/index');

const filterTuitionFeeByRole = async (req, res, next) => {
    try {
        const userRole = req.user.role??'';

        // Admin thì không cần lọc, đi thẳng vào controller
        if (userRole === 'admin') {
            return next();
        }
        // Parent thì chỉ xem được student thuộc mình
        if (userRole === 'parent') {
            const students = await Student.findAll({
                attributes: ['id'],
                where: { parent_id: req.user.id }
            });

            if (!students.length) {
                return res.status(404).json({
                    message: 'No students found for this parent'
                });
            }

            const studentIds = students.map(s => s.id);

            // Nếu parent truyền ?student_id=x lên thì kiểm tra có hợp lệ không
            const requestedId = req.queryOptions.tuitionFee.where?.student_id;
            if (requestedId) {
                if (!studentIds.includes(Number(requestedId))) {
                    return res.status(403).json({
                        message: 'Forbidden'
                    });
                }
                // student_id hợp lệ, giữ nguyên filter đó
            } else {
                // Không truyền thì tự động filter theo danh sách con của parent
                req.queryOptions.tuitionFee.where.student_id = {
                    [Op.in]: studentIds
                };
            }

            return next();
        }

        return res.status(403).json({ message: 'Forbidden' });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = filterTuitionFeeByRole;