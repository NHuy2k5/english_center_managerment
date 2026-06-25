const { payTuitionFeesMultiple } = require("../services/tuitionfee.service");

const getTuitionFeesController = async (req, res) => {
    try {
        const tuitionFeeQuery = req.queryOptions.tuitionFee;

        const hasWhere = obj => obj && Object.keys(obj).length > 0;

        const rows = await TuitionFee.findAll({
            ...(hasWhere(tuitionFeeQuery.where) && {
                where: tuitionFeeQuery.where
            }),
            ...(tuitionFeeQuery.order?.length && {
                order: tuitionFeeQuery.order
            }),
            ...(req.queryOptions.limit != null && {
                limit: req.queryOptions.limit,
                offset: req.queryOptions.offset
            })
        });

        if (!rows.length) {
            return res.status(404).json({
                message: 'Tuition fees not found'
            });
        }

        return res.status(200).json({
            data: rows,
            count: rows.length
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
const payTuitionFeesMultipleController = async (req, res) => {
    try {
        const { coupon_id,student_ids,parent_id,months } = req.body;

        // Validate query params
        if (!parent_id || !student_ids || !months?.length) {
            return res.status(400).json({
                message: 'parent_id, student_ids, months are required'
            });
        }

        if (!student_ids.length) {
            return res.status(400).json({
                message: 'student_ids is invalid'
            });
        }

        // Validate months array
        const isValidMonths = months.every(
            m => m.month >= 1 && m.month <= 12 && m.year > 0
        );
        if (!isValidMonths) {
            return res.status(400).json({
                message: 'months must have valid month (1-12) and year'
            });
        }

        const result = await payTuitionFeesMultiple({
            parentId:   parseInt(parent_id),
            studentIds,
            months,
            couponId:   coupon_id ? parseInt(coupon_id) : null
        });

        return res.status(result.status).json({
            data:    result.data,
            message: result.message
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
// POST /tuition-fees/preview
/*
    req.body:
    {
        "student_ids": [1, 2, 3],
        "months": [
            { "month": 6, "year": 2026 },
            { "month": 7, "year": 2026 }
        ],
        "coupon_id": 1
    }
*/
const previewTuitionFeesController = async (req, res) => {
    try {
        const { student_ids, months, coupon_id } = req.body;

        // Validate
        if (!student_ids?.length || !months?.length) {
            return res.status(400).json({
                message: 'student_ids, months are required'
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

        // Preview từng tháng song song
        const allPreviews = await Promise.all(
            months.map(({ month, year }) =>
                previewMonthlyTuitionFees({
                    studentIds: student_ids,
                    month,
                    year,
                    couponId: coupon_id || null
                }).then(items => items.map(item => ({ ...item, month, year })))
            )
        );

        const allItems = allPreviews.flat();

        const totalAmount = allItems.reduce(
            (sum, item) => sum + item.payable_amount,
            0
        );

        return res.status(200).json({
            data: {
                total_amount: totalAmount,
                total_months: months.length,
                total_students: student_ids.length,
                detail: allItems
            }
        });

    } catch (err) {
        const businessErrors = [
            'Coupon not found',
            'Coupon not yet valid',
            'Coupon has expired'
        ];
        if (businessErrors.includes(err.message)) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: err.message });
    }
};
module.exports = {getTuitionFeesController, payTuitionFeesMultipleController, previewTuitionFeesController}