const { Student,
    Parent,
    User,
    Role,
    UserRole,
    StudentClass,
    StudentLesson,
    Lesson,
    Class,
    Coupon,
    TuitionFee,
    sequelize,
    Sequelize } = require("../models/index");
const { Op, fn, col, literal } = require('sequelize');
const dayjs = require('dayjs');
/*  req.body
    {
        "student_ids": [1,2,3],
        "month": 6,
        "year": 2026,
        "coupon_id": 1
    }
*/

const calculateTuitionAggregate = async ({
    studentIds,
    month,
    year
}) => {

    const startDate = dayjs()
        .year(year)
        .month(month - 1)
        .startOf('month')
        .toDate();

    const endDate = dayjs()
        .year(year)
        .month(month - 1)
        .endOf('month')
        .toDate();

    const tuition =
        await StudentLesson.findAll({
            raw: true,
            where: {
                student_id: {
                    [Op.in]: studentIds
                },

                status: "attended"
            },


            include: [


                {
                    model: Lesson,
                    include: [
                        {
                            model: Class,
                            attributes: []
                        }
                    ],
                    where: {

                        status: {
                            [Op.ne]: "canceled"
                        },


                        start: {
                            [Op.gte]: startDate,
                            [Op.lte]: Sequelize.literal(
                                `
                                CASE
                                WHEN Student->StudentClass.left_at IS NOT NULL
                                THEN Student->StudentClass.left_at
                                ELSE '${endDate}'
                                END
                                `
                            )
                        }

                    },
                    attributes: [
                        "class_id",
                        "start",
                        "listed_price"
                    ],

                },
                {
                    model: Student,

                    attributes: [],

                    include: [{
                        model: User,
                        as: 'student_user',
                        attributes: []
                    },
                    {
                        model: StudentClass,

                        where: {
                            class_id: {
                                [Op.col]:
                                    "Lesson.class_id"
                            },
                            [Op.or]: [
                                {
                                    left_at: null,

                                },
                                Sequelize.where(
                                    Sequelize.col("Lesson.start"),
                                    Op.lte,
                                    Sequelize.col("Student->StudentClass.left_at")
                                )
                            ]
                        },
                        attributes: ["left_at"]
                    }
                    ]

                },

            ],
            attributes: [
                "student_id",
                [
                    Sequelize.col("Student->student_user.full_name"), "student_name",
                ],
                [
                    Sequelize.col("Lesson.class_id"),
                    "class_id"
                ],
                [
                    Sequelize.col("Lesson->Class.name"), "class_name",
                ],
                [
                    Sequelize.fn("COUNT", Sequelize.col("StudentLesson.id")),
                    "total_reality_lessons"
                ],
                [
                    Sequelize.fn("SUM", Sequelize.col("Lesson.listed_price")),
                    "actual_listed_tuition_fee"
                ],
            ],
            group: [
                "StudentLesson.student_id",
                "Student.id",
                "Student->student_user.full_name",
                "Lesson.class_id",
                "Lesson->Class.id"
            ]
        });
    return tuition;
};
const applyCoupon = (
    amount,
    coupon
) => {

    if (!coupon) {
        return amount;
    }

    return Math.round(
        amount *
        (100 - coupon.discount)
        / 100
    );
};
// Lấy danh sách học phí nhiều học sinh
/* Đầu ra
[
    {
        student_id: 1,
        student_name: ...,
        class_id: 2,
        class_name: ...,
        total_reality_lessons: 8,
        actual_listed_tuition_fee: 800000,
        payable_amount: 640000,
        coupon_id: 1
    }
]
*/
const previewMonthlyTuitionFees = async ({
    studentIds,
    month,
    year,
    couponId
}) => {
    const aggregate =
        await calculateTuitionAggregate({
            studentIds,
            month,
            year
        });
    let coupon = null;

    if (couponId) {

        coupon = await Coupon.findByPk(
            couponId
        );

        if (!coupon) {
            throw new Error(
                'Coupon not found'
            );
        }
        const now = dayjs();
        if (coupon.start && dayjs(coupon.start).isAfter(now)) {
            throw new Error('Coupon not yet valid');
        }
        if (coupon.end && dayjs(coupon.end).isBefore(now)) {
            throw new Error('Coupon has expired');
        }
    }
    return aggregate.map(item => ({
        ...item,
        coupon_id:
            coupon?.id || null,

        payable_amount:
            applyCoupon(Number(item.actual_listed_tuition_fee), coupon)
    }));
};
/*  req.body
    {
        "parent_id": 5,
        "student_ids": [1, 2, 3],
        "months": [
            { "month": 6, "year": 2026 },
            { "month": 7, "year": 2026 }
        ],
        "coupon_id": 1
    }
*/
const payTuitionFeesMultiple = async ({
    parentId,
    studentIds,
    months,   // [{ month, year }, ...]
    couponId
}) => {
    const transaction = await sequelize.transaction();

    try {
        // 1. Kiểm tra parent
        const parent = await Parent.findByPk(parentId, { transaction });
        if (!parent) {
            throw new Error('Parent not found');
        }

        // 2. Kiểm tra coupon 1 lần duy nhất cho tất cả các tháng
        let coupon = null;
        if (couponId) {
            coupon = await Coupon.findByPk(couponId);
            if (!coupon) {
                throw new Error('Coupon not found');
            }
            const now = dayjs();
            if (coupon.start && dayjs(coupon.start).isAfter(now)) {
                throw new Error('Coupon not yet valid');
            }
            if (coupon.end && dayjs(coupon.end).isBefore(now)) {
                throw new Error('Coupon has expired');
            }
        }

        // 3. Preview tất cả các tháng
        // Không truyền couponId vào calculateTuitionAggregate
        // vì applyCoupon sẽ được xử lý thủ công bên dưới
        const allPreviews = await Promise.all(
            months.map(({ month, year }) =>
                calculateTuitionAggregate({ studentIds, month, year })
                    .then(aggregate => aggregate.map(item => ({
                        ...item,
                        month,
                        year,
                        coupon_id: coupon?.id || null,
                        payable_amount: applyCoupon(
                            Number(item.actual_listed_tuition_fee),
                            coupon
                        )
                    })))
            )
        );

        // 4. Flatten tất cả các tháng thành 1 mảng
        const allItems = allPreviews.flat();

        // 5. Tính tổng tiền toàn bộ
        const totalAmount = allItems.reduce(
            (sum, item) => sum + item.payable_amount,
            0
        );

        // 6. Kiểm tra số dư 1 lần — nếu thiếu rollback toàn bộ
        if (parent.balance < totalAmount) {
            throw new Error(
                `Insufficient balance. Required: ${totalAmount}, Available: ${parent.balance}`
            );
        }

        // 7. Trừ tiền
        parent.balance -= totalAmount;
        await parent.save({ transaction });

        // 8. Tạo TuitionFee records cho tất cả tháng
        await TuitionFee.bulkCreate(
            allItems.map(item => ({
                student_id:                 item.student_id,
                class_id:                   item.class_id,
                the_first_of_the_month:     dayjs().year(item.year).month(item.month - 1).startOf('month').format('YYYY-MM-DD'),
                the_end_of_the_month:       dayjs().year(item.year).month(item.month - 1).endOf('month').format('YYYY-MM-DD'),
                total_reality_lessons:      item.total_reality_lessons,
                actual_listed_tuition_fee:  item.actual_listed_tuition_fee,
                coupon_id:                  item.coupon_id,
                have_student_paid:          true
            })),
            { transaction,
                ignoreDuplicates: true 
             }
        );

        await transaction.commit();

        return {
            status: 200,
            data: {
                total_amount: totalAmount,
                total_months: months.length,
                total_students: studentIds.length,
                detail: allItems
            },
            message: 'Pay success'
        };

    } catch (err) {
        await transaction.rollback();
        return {
            status: 400,
            message: err.message
        };
    }
};

module.exports = { previewMonthlyTuitionFees, payTuitionFeesMultiple };