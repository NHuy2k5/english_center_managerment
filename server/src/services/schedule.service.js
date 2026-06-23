const { where, Op } = require("sequelize");
const { Student,
    Lesson,
    Teacher,
    User,
    Class,
    Role,
    UserRole,
    StudentLesson,
    Assignment,
    sequelize } = require("../models/index");
const { transformScheduleStudent } = require('../transformers/scheduleStudent.tranformer');
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

        try {
            const userRole = await UserRole.findOne({
                where: {
                    user_id: userID
                },
                include: [{
                    model: Role,
                    attributes: ['name']
                }],
            });
            if (!userRole) {
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
                });
                if (!teacher) {
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
                });
                return {
                        status: 404,
                        message: "Schedules not found"
                    }
            }
            else if (userRole.Role.name === 'student') {
                // Check userID có role là tồn tại trong table students không
                const student = await Student.findOne({
                    where: {
                        id: userID
                    },
                    
                });
                if (!student) {
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
                    
                });
                if (rows.length === 0) {
                    
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
                    
                });
                if (students.length === 0) {
                    
                    return {
                        status: 404,
                        message: "Parent has not student"
                    }
                }
                studentsID = students.map(s => s.id);
                rows = await StudentLesson.findAll({
                    where: {
                        student_id: {
                            [Op.in]: studentsID
                        }
                    },
                    include: studentLessonInclude,
                    
                });
                if (rows.length === 0) {
                    
                    return {
                        status: 404,
                        message: "Schedules not found"
                    }
                }
                rows = rows.map(transformSheduleStudent);
            }
            return {
                status: 200,
                data: rows,
                message: "Schedules found"
            };
        } catch (error) {
            
            return {
                status: 400,
                message: error.message
            };
        }
    },
}