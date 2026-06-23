const { Student,
    User,
    Role,
    UserRole,
    Assignment,
    Lesson,
    Teacher,
    MonthlyTeacherSalary,
    sequelize,
    Sequelize } = require("../models/index");
const { Op, fn, col, literal } = require('sequelize');
const {transformSalary} = require('../transformers/monthlyTeacherSalary.transformer');
/*  req.body
    {
        "teacher_ids": [1,2,3],
        "month": 6,
        "year": 2026
    }
*/

const { Op, fn, col, literal } = require('sequelize');
// Tạo lương hàng tháng
const generateMonthlyTeacherSalary = async ({
    teacherIds,
    month,
    year,
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

    const rows = await Assignment.findAll({
        where: {
            status: 'teaching',
            ...(teacherIds?.length && {
                teacher_id: {
                    [Op.in]: teacherIds
                }
            })
        },

        attributes: [
            'teacher_id',
            [
                Sequelize.col("Teacher->teacher_user.full_name"), "teacher_name",
            ],

            [
                fn('COUNT',col('Lessons.id')),'total_lessons'
            ],

            [
                literal(`COUNT(Lessons.id) * Assignment.pay_per_lesson`),
                'salary'
            ]
        ],

        include: [
            {
                model: Lesson,
                attributes: [],
                required: true,

                where: {
                    status: {
                        [Op.ne]: 'canceled'
                    },

                    start_date: {
                        [Op.between]: [
                            startDate,
                            endDate
                        ]
                    }
                }
            },
            {
                model: Teacher,
                attributes: [],
                required: true
            }
        ],

        group: [
            'Assignment.id',
            'Assignment.teacher_id',
            'Assignment.pay_per_lesson'
        ],

        raw: true
    });

    const grouped = {};

    for (const row of rows) {
        const teacherId = row.teacher_id;

        if (!grouped[teacherId]) {
            grouped[teacherId] = {
                totalLessons: 0,
                salary: 0
            };
        }

        grouped[teacherId].totalLessons += Number(
            row.total_lessons
        );

        grouped[teacherId].salary += Number(
            row.salary
        );
    }

    const salaries = Object.entries(grouped)
        .map(([teacherId, data]) => ({
            teacher_id: teacherId,

            the_first_of_the_month:
                dayjs(startDate).format(
                    'YYYY-MM-DD'
                ),

            the_end_of_the_month:
                dayjs(endDate).format(
                    'YYYY-MM-DD'
                ),

            total_lessons_teached:
                data.totalLessons,

            monthly_salary:
                data.salary,

            is_teacher_paid: false
        }));

    await MonthlyTeacherSalary.bulkCreate(
        salaries,
        {
            updateOnDuplicate: [
                'total_lessons_teached',
                'monthly_salary'
            ]
        }
    );

    return salaries;
};
// Hàm lấy lương giáo viên
const getMonthlyTeacherSalaries = async ({
    month,
    year,
    teacherIds
}) => {

    const startDate = dayjs()
        .year(year)
        .month(month - 1)
        .startOf('month')
        .format('YYYY-MM-DD');

    const salaries = MonthlyTeacherSalary.findAll({
        where: {

            the_first_of_the_month:
                startDate,

            ...(teacherIds?.length && {
                teacher_id: {
                    [Op.in]: teacherIds
                }
            })
        },

        include: [
            {
                model: Teacher,
                attributes: ["id"],
                include: [{
                    model: User,
                    as: 'teacher_user',
                    attributes: ['fullname', 'phone', 'email']
                }]
            }
        ],

        order: [
            ['teacher_id', 'ASC']
        ]
    });
    if(salaries.length === 0){
        return {
            status: 404,
            message: 'Salaries not found'
        }
    }
    return {
        status: 200,
        data: salaries.map(transformSalary),
        message: 'Salaries not found'
    }
};
// Hàm trả tiền lương
const payTeacherSalary = async (
    salaryIds
) => {

    const t =
        await sequelize.transaction();

    try {

        const salaries =
            await MonthlyTeacherSalary.findAll({
                where: {
                    id: {
                        [Op.in]: salaryIds
                    },
                    is_teacher_paid: false
                },

                transaction: t
            });

        if (!salaries.length) {
            throw new Error(
                'No unpaid salary found'
            );
        }

        const teacherBalanceMap =
            new Map();

        for (const salary of salaries) {

            const teacherId =
                salary.teacher_id;

            if (
                !teacherBalanceMap.has(
                    teacherId
                )
            ) {
                teacherBalanceMap.set(
                    teacherId,
                    0
                );
            }

            teacherBalanceMap.set(
                teacherId,
                teacherBalanceMap.get(
                    teacherId
                ) +
                    Number(
                        salary.monthly_salary
                    )
            );

            salary.is_teacher_paid =
                true;
        }

        const teacherIds =
            [...teacherBalanceMap.keys()];

        const teachers =
            await Teacher.findAll({
                where: {
                    id: {
                        [Op.in]:
                            teacherIds
                    }
                },

                transaction: t
            });

        for (const teacher of teachers) {

            teacher.balance +=
                teacherBalanceMap.get(
                    teacher.id
                );
        }

        await Promise.all([
            ...teachers.map(
                teacher =>
                    teacher.save({
                        transaction: t
                    })
            ),

            ...salaries.map(
                salary =>
                    salary.save({
                        transaction: t
                    })
            )
        ]);

        await t.commit();

        return {
            status: 200,
            data: {
                paidTeachers:
                teacherIds.length,
                paidMonths:
                salaries.length
            }
        };

    } catch (err) {
        await t.rollback();
        return {
            status: 400,
            message: error.message
        };
    }
};

module.exports = {generateMonthlyTeacherSalary,payTeacherSalary, getMonthlyTeacherSalaries}