const { Student,
    Parent,
    User,
    Role,
    Lesson,
    UserRole,
    StudentClass,
    StudentLesson,
    TuitionFee,
    sequelize } = require("../models/index");
const { Op, fn, col, literal } = require('sequelize'); 
const { transformAttendance } = require("../transformers/attendance.transformer");
const VALID_STATUS = [
    'ready',
    'attended',
    'excused-absence',
    'unexcused-absence'
];
module.exports = {
    getClassAttendances: async (classId) => {
        /*
        [
            {
                "lesson_id": 1,
                "lesson_name": "Buổi 1",
                "start": "...",
                "students": [
                    {   
                        "student_id": 1,
                        "full_name": "Nguyễn Văn A",
                        "status": "attended"
                    }
                ]
            }
        ]
    */
        const lessons = await Lesson.findAll({
            paranoid: false,
            where: {
                class_id: classId
            },
            attributes: [
                'id',
                'name',
                'start',
                'end'
            ],
            include: [{
                model: StudentLesson,
                attributes: ['status'],
                include: [{
                    model: Student,
                    attributes: ['id'],
                    include: [{
                        model: User,
                        as: 'student_user',
                        attributes: ['full_name']
                    }]
                }]
            }],
            order: [['start', 'ASC']]
        });
        if (lessons.length == 0) {
            return {
                status: 404,
                message: "Attendances not found"
            }
        }
        return {
            status: 200,
            data: lessons.map(transformAttendance),
            message: 'Attendances found'
        };
    },
    getLessonAttendance: async (lessonId) => {
        const lesson = await Lesson.findByPk(lessonId, {
            paranoid: false,
            attributes: [
                'id',
                'name',
                'start',
                'end'
            ],
            include: [{
                model: StudentLesson,
                attributes: [
                    'student_id',
                    'status'
                ],
                include: [{
                    model: Student,
                    attributes: ['id'],
                    include: [{
                        model: User,
                        as: 'student_user',
                        attributes: ['full_name']
                    }]
                }]
            }]
        });

        if (!lesson) {
            return {
                status: 404,
                message: "Lesson not found"
            }
        }
        return {
            status: 200,
            data: transformAttendance(lesson)
        };
    },
    /*
    {
        req.body post
        "attendances": [
            {
                "student_id": 1,
                "status": "attended"
            },
            {
                "student_id": 2,
                "status": "excused-absence"
            }
        ]
    }
    */
    updateLessonAttendance: async (lessonId, attendances) => {
        const t = await sequelize.transaction();

        try {
            const lesson = await Lesson.findByPk(
                lessonId,
                { transaction: t }
            );

            if (!lesson) {
                await t.rollback();
                return {
                    status: 404,
                    message: 'Lesson not found'
                };
            }
            const studentIds = attendances.map(
                x => x.student_id
            );

            const studentLessons = await StudentLesson.findAll({
                where: {
                    lesson_id: lessonId,
                    student_id: {
                        [Op.in]: studentIds
                    }
                },
                transaction: t
            });

            const map = new Map(
                studentLessons.map(sl => [
                    sl.student_id,
                    sl
                ])
            );
            const changedRows = [];
            for (const item of attendances) {
                if (
                    !VALID_STATUS.includes(item.status)
                ) {
                    throw new Error(
                        `Invalid status: ${item.status}`
                    );
                }
                const row = map.get(item.student_id);
                if (!row) {
                    throw new Error(
                        `Student ${item.student_id} not found`
                    );
                }
                changedRows.push(row);

                row.status = item.status;
            }

            await Promise.all(
                changedRows.map(sl =>
                    sl.save({ transaction: t })
                )
            );

            await t.commit();

            return {
                status: 200,
                message: 'Attendance updated'
            };

        } catch (error) {

            await t.rollback();
            return {
                status: 400,
                message: error.message
            };
        }
    }
}