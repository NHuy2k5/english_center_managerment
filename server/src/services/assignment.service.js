const { Assignment,
    Teacher,
    User,
    Role,
    Lesson,
    Class,
    sequelize } = require("../models/index");
const { transformAssignment } = require('../transformers/assignment.transformer');
const query = (assignmentQuery = {}) => {
    const hasWhere = where => where && Object.keys(where).length > 0;
    return {
        distinct: true,
        ...(assignmentQuery.limit != null && { limit: assignmentQuery.limit }),
        ...(assignmentQuery.offset != null && { offset: assignmentQuery.offset }),
        ...(assignmentQuery.assignment?.attributes?.length && { attributes: assignmentQuery.assignment.attributes }),
        order: [
            ...(assignmentQuery.assignment?.order || []),
        ],
        ...(hasWhere(assignmentQuery.assignment?.where) && {
            where: assignmentQuery.assignment.where
        }),
        include: [
            {
                model: Teacher,
                required: true,
                attributes: ['id'],
                include: [{
                    model: User,
                    as: 'teacher_user',
                    attributes: ["full_name"]
                }]
            },
            {
                model: Lesson,
                required: true,
                attributes: {
                    exclude: ['listed_price', 'class_id']
                },
                include: [{
                    model: Class,
                    require: true,
                    attributes: ["name"]
                }]
            }
        ]
    };
}
const createAssignment = async (data) => {
    const t = await sequelize.transaction();
    try {
        message = [];
        const lesson = Lesson.findOne({
            where: {
                id: data.lesson_id
            },
            transaction: t
        });
        if (!lesson) {
            message.push('Lesson id is not valid')
        }
        const teacher = Teacher.findOne({
            where: {
                id: data.teacher_id
            },
            transaction: t
        });
        if (!teacher) {
            message.push('Teacher id is not valid')
        }
        if (!teacher || !lesson) {
            throw new Error(message)
        }
        const assignment = await Assignment.create({
            lesson_id: data.lesson_id,
            teacher_id: data.teacher_id,
            status: 'teaching',
            pay_per_lesson: data.pay_per_lesson || 0,
            created_at: new Date(),
            updated_at: new Date()
        }, { transaction: t });
        await t.commit();
        const result = await Assignment.findByPk(assignment.id, query());

        return {
            status: 201,
            data: transformAssignment(result),
            message: "Create success"
        };
    } catch (error) {
        await t.rollback();
        return {
            status: 400,
            message: error.message
        };
    }
};
const deleteAssignment = async (id) => {
    const t = await sequelize.transaction();
    try {
        const assignment = await Assignment.findByPk(id, { transaction: t });
        if (!assignment) {
            await t.rollback();
            return {
                status: 404,
                message: "Assignment not found"
            };
        };
        const status = await Assignment.destroy({
            where: {
                id
            },
            transaction: t
        });
        if (!status) {
            throw new Error("Delete failed");
        }
        await t.commit();
        return {
            status: 200,
            message: "Delete success"
        };
    } catch (error) {
        await t.rollback();
        return {
            status: 400,
            message: error.message
        };
    }
}
const changeTeacher = async (newTeacherData, assignmentID) => {
    const t = await sequelize.transaction();
    try {
        if (!newTeacherData.teacher_id) {
            throw new Error('New teacher_id is required');
        }

        const oldAssignment = await Assignment.findByPk(assignmentID, { transaction: t });
        if (!oldAssignment) {
            return { status: 404, message: 'Assignment not found' };
        }

        if (newTeacherData.teacher_id == oldAssignment.teacher_id) {
            throw new Error('New Teacher ID must be different from old teacher ID');
        }

        const [newTeacher, existedAssignment] = await Promise.all([
            Teacher.findByPk(newTeacherData.teacher_id, { transaction: t }),
            Assignment.findOne({
                where: {
                    lesson_id: oldAssignment.lesson_id,
                    teacher_id: newTeacherData.teacher_id
                },
                transaction: t
            })
        ]);

        if (!newTeacher) {
            return { status: 404, message: 'New teacher not found' };
        }
        if (existedAssignment) {
            throw new Error('New teacher already assigned to this lesson');
        }

        await oldAssignment.update({
            teacher_id: newTeacherData.teacher_id,
            status: 'substitute_teach',
            pay_per_lesson: newTeacherData.pay_per_lesson
        }, { transaction: t });

        await t.commit();
        return { status: 200, message: 'Change teacher success' };

    } catch (error) {
        await t.rollback();
        return { status: 400, message: error.message };
    }
};
// Lấy danh sách 
/*
    [{
        id: ...,
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
    Assignments ban đầu return từ findAll
    [{
        id: ...,
        status: ...,
        ...
        Teacher: {
            id: ...,
            teacher_user: {
                full_name: ...
            }
        },
        Lesson: {
            ....,
            class_id: ...,
            Class: {
                name: ...
            }
        }

    ]}
*/
const getAssignments = async (assignmentQuery = {}) => {
    let rows;
    let count;
    rows = await Assignment.findAll(query(assignmentQuery));
    count = rows.length;
    rows = rows.map(transformAssignment);
    if (count === 0) {
        return {
            status: 404,
            message: "Assignments not found"
        }
    }
    return {
        status: 200,
        data: rows,
        count,
        message: "Assignments found"
    };
};
const getAssignment = async (id) => {
    const assignment = await Assignment.findByPk(id, query())
    if (!assignment) {
        return {
            status: 404,
            message: "Assignment not found"
        }
    }
    return {
        status: 200,
        data: transformAssignment(assignment),
        message: "Assignment found"
    }
};
module.exports = {
    createAssignment, getAssignment, getAssignments, changeTeacher, deleteAssignment
}