const { Student,
    Parent,
    User,
    Role,
    UserRole,
    StudentClass,
    StudentLesson,
    TuitionFee,
    sequelize,
    Sequelize } = require("../models/index");
const { Op, fn, col, literal } = require('sequelize');
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
            startDate,
            endDate
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
        "parent_id: 5"
        "student_ids": [1,2,3],
        "month": 6,
        "year": 2026,
        "coupon_id": 1
    }
*/
const payTuitionFees = async ({
    parentId,
    studentIds,
    month,
    year,
    couponId
}) => {

    const transaction =
        await sequelize.transaction();

    try {

        const parent =
            await Parent.findByPk(
                parentId,
                {
                    transaction
                }
            );

        if (!parent) {
            throw new Error(
                'Parent not found'
            );
        }

        const preview =
            await previewMonthlyTuitionFees({
                studentIds,
                month,
                year,
                couponId
            });

        const totalAmount =
            preview.reduce(
                (sum, item) =>
                    sum +
                    item.payable_amount,
                0
            );
        if (parent.balance < totalAmount) {
            throw new Error(
                'Insufficient balance'
            );
        }
        parent.balance -= totalAmount;

        await parent.save({
            transaction
        });

        const startMonth =
            dayjs()
                .year(year)
                .month(month - 1)
                .startOf('month')
                .format('YYYY-MM-DD');

        const endMonth =
            dayjs()
                .year(year)
                .month(month - 1)
                .endOf('month')
                .format('YYYY-MM-DD');

        await TuitionFee.bulkCreate(
            preview.map(item => ({
                student_id:
                    item.student_id,

                class_id:
                    item.class_id,

                the_first_of_the_month:
                    startMonth,

                the_end_of_the_month:
                    endMonth,

                total_reality_lessons:
                    item.totalRealityLessons,

                actual_listed_tuition_fee:
                    item.actualListedTuitionFee,

                coupon_id:
                    item.coupon_id,

                have_student_paid:
                    true
            })),
            {
                transaction
            }
        );

        await transaction.commit();

        return {
            status: 200,
            data: totalAmount,
            message: "Pay success"
        };

    } catch (err) {

        await transaction.rollback();
        return {
            status: 400,
            message: error.message
        };
    }
};
module.exports = {previewMonthlyTuitionFees, payTuitionFees}