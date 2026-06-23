const { where, Op } = require("sequelize");
const { Student,
    Teacher,
    User,
    Class,
    Role,
    UserRole,
    StudentLesson,
    Assignment,
    sequelize } = require("../models/index");
const { transformSheduleStudent } = require('../transformers/scheduleStudent.tranformer');
const { getAssignments } = require("./assignment.service");
const studentLessonInclude = [
    {
        model: Student,
        required: true,
        attributes: ['id'],
        include: [{
            model: User,
            as: 'student_user',
            attributes: ['full_name']
        }]
    },
    {
        model: Lesson,
        required: true,
        include: [
            {
                model: Class,
                required: true,
                attributes: ['name'],
            }
            , {
                model: Assignment,
                attributes: ['teacher_id'],
                required: false,
                include: [{
                    model: Teacher,
                    required: true,
                    attributes: ['id'],
                    include: [{
                        model: User,
                        as: 'teacher_user',
                        attributes: ['full_name']
                    }]
                }]
            }
        ]
    }
]
module.exports = {
    // Đối với giáo viên
    /*
       [{
        id: ...,
        status:...,
        teacher: {
            id: ...,
            full_name: ...,
        },
        lesson: {
            ....,
            class_id: ...,
            class_name: ...,
        }
 
    ]}
    // Đối với học sinh
    [{
        id: ...,
        status: ...,
        student: {
            id: ...,
            full_name: ...,
        },
        teacher: {
            id: ...,
            full_name: ...,
        }
        lesson: {
            ....,
            class_id: ...,
            class_name: ...,
        },
 
    ]}
    */

    getSchedules: async (userID) => {
        let rows;
        const t = await sequelize.transaction();

        try {
            const userRole = await UserRole.findOne({
                where: {
                    user_id: userID
                },
                include: [{
                    model: Role,
                    attributes: ['name']
                }],
                transaction: t
            });
            if (!userRole) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Schedules not found"
                }
            };
            let studentsID = [];
            if (userRole.Role.name === 'teacher') {
                // Check userID có role là tồn tại trong table teachers không
                const teacher = await Teacher.findOne({
                    where: {
                        id: userID
                    },
                    transaction: t
                });
                if (!teacher) {
                    await t.rollback();
                    return {
                        status: 404,
                        message: "Teacher ID is invalid"
                    }
                }
                rows = await getAssignments({
                    assignment: {
                        where: {
                            teacher_id: userID,
                        }
                    }
                })
            }
            else if (userRole.Role.name === 'student') {
                // Check userID có role là tồn tại trong table students không
                const student = await Student.findOne({
                    where: {
                        id: userID
                    },
                    transaction: t
                });
                if (!student) {
                    await t.rollback();
                    return {
                        status: 404,
                        message: "Student ID is invalid"
                    }
                }

                rows = await StudentLesson.findAll({
                    where: {
                        student_id: userID
                    },
                    include: studentLessonInclude,
                    transaction: t
                });
                if (rows.length === 0) {
                    await t.rollback();
                    return {
                        status: 404,
                        message: "Schedules not found"
                    }
                }
                rows = rows.map(transformSheduleStudent);
            }
            else if (userRole.Role.name === 'parent') {
                const students = await Student.findAll({
                    attributes: ['id'],
                    where: {
                        parent_id: userID
                    },
                    transaction: t
                });
                if (students.length === 0) {
                    await t.rollback();
                    return {
                        status: 404,
                        message: "Parent has not student"
                    }
                }
                studentsID = students.map(s => s.id);
                rows = await StudentLesson.findAll({
                    where: {
                        student_id: {
                            [Op.in]: students.map(student => student.id)
                        }
                    },
                    include: studentLessonInclude,
                    transaction: t
                });
                if (rows.length === 0) {
                    await t.rollback();
                    return {
                        status: 404,
                        message: "Schedules not found"
                    }
                }
                rows = rows.map(transformSheduleStudent);
            }
            await t.commit();
            return {
                status: 200,
                data: rows,
                message: "Schedules found"
            };
        } catch (error) {
            await t.rollback();
            return {
                status: 400,
                message: error.message
            };
        }
    },
}