const { Op } = require("sequelize");
const {
    Class,
    Course,
    Student,
    Teacher,
    UserRole,
    Role,
    StudentClass,
    TeacherClass,
    Lesson,
    TuitionFee,
    StudentLesson,
    DataTypes,
    sequelize } = require("../models/index");
const { transformClass } = require('../transformers/class.transformer');
const buildComputedAttributes = require('../utilities/build-field');
const buildOrder = require('../utilities/build-order');
const DEFAULT_CLASS_VIRTUAL_FIELDS = [
    'total_lessons',
    'total_lessons_finished',
    'total_students_registered',
    'total_students_dropped_out'
];
const query = (classQuery = {}) => {
    const hasWhere = where => where && Object.keys(where).length > 0;
    const hasSelectFields =
        classQuery.cLass?.attributes?.length > 0 ||
        classQuery.cLass?.virtualAttributes?.length > 0;
    return {
        paranoid: false,
        distinct: true,
        ...(classQuery.limit != null && { limit: classQuery.limit }),
        ...(classQuery.offset != null && { offset: classQuery.offset }),
        attributes: hasSelectFields
            ?
            [
                ...(classQuery.cLass.attributes || []),

                ...buildComputedAttributes(
                    classQuery.cLass.virtualAttributes || []
                )
            ]
            :
            [
                // lấy tất cả cột thật
                ...Object.keys(Class.getAttributes())
                    .filter(
                        key =>
                            Class.getAttributes()[key]
                                .type !== DataTypes.VIRTUAL
                    ),

                // thêm tất cả cột ảo
                ...buildComputedAttributes(
                    DEFAULT_CLASS_VIRTUAL_FIELDS
                )
            ],

        order: [
            ...(classQuery.cLass?.order ? buildOrder(classQuery.cLass.order) : [])
        ],
        ...(hasWhere(classQuery.cLass?.where) && {
            where: classQuery.cLass.where
        }),
        include: [{
            model: Course,
            attributes: ['id', 'name']
        }]
    };
}
module.exports = {
    // Lấy danh sách lớp
    /*
        [{
            id: ...,
            name: ...,
            ...
            course: {
                name: ...
            }
        ]}
    */
    getClasss: async (classQuery = {}) => {
        let rows;
        let count;
        if (classQuery.limit != null) {
            const result = await Class.findAndCountAll(query(classQuery));
            rows = result.rows.map(transformClass);
            count = result.count;
        } else {
            rows = await Class.findAll(query(classQuery));
            count = rows.length;
            rows = rows.map(transformClass);
        }
        if (count === 0) {
            return {
                status: 404,
                message: "Classs not found"
            }
        }
        return {
            status: 200,
            data: rows,
            count,
            message: "Classs found"
        };
    },
    getClass: async (id) => {
        const cLass = await Class.findByPk(id, query())
        if (!cLass) {
            return {
                status: 404,
                message: "Class not found"
            }
        }
        return {
            status: 200,
            data: transformClass(cLass),
            message: "Class found"
        }
    },
    createClass: async (data) => {
        const t = await sequelize.transaction();
        try {
            // Thêm thông tin user
            const cLass = await Class.create({
                name: data.name,
                total_students: data.total_students,
                course_id: data.course_id ?? null,
                status: data.status,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            await t.commit();
            const result = await Class.findByPk(cLass.id, query());
            return {
                status: 201,
                data: transformClass(result),
                message: "Create success"
            };
        } catch (error) {
            await t.rollback();
            return {
                status: 400,
                message: error.message
            };
        }
    },
    updateClass: async (data, id) => {
        const t = await sequelize.transaction();
        try {
            const cLass = await Class.findByPk(id, { transaction: t });
            if (!cLass) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Class not found"
                };
            };
            const classData = {};
            if ('name' in data) {
                classData.name = data.name;
            };
            if ('course_id' in data) {
                classData.course_id = data.course_id;
            }
            if ('total_students' in data) {
                const currentStudent = await StudentClass.count({
                    where: {
                        class_id: id,
                        left_at: null
                    },
                    transaction: t
                });
                if (data.total_students < currentStudent) {
                    throw Error(
                        "Total students cannot smaller than current students"
                    );
                }
                classData.total_students = data.total_students;
            }
            if ('status' in data) {
                classData.status = data.status
            }
            await cLass.update(classData,
                {
                    transaction: t
                });
            await t.commit();
            const result = await Class.findByPk(id, query());
            return {
                status: 200,
                data: transformClass(result),
                message: "Update success"
            };
        } catch (error) {
            await t.rollback();
            return {
                status: 400,
                message: error.message
            };
        }
    },
    addStudentOrTeacherToClass: async (classID, userID) => {
        const t = await sequelize.transaction();
        try {
            let message = [];
            // Kiểm tra sự tồn tại của class và student
            const cLass = await Class.findByPk(classID, { transaction: t });
            if (!cLass) {
                message.push("Class not found");
            };
            const userRole = await UserRole.findOne({
                where: {
                    user_id: userID,
                },
                include: [{
                    model: Role,
                    required: true,
                    attributes: ['name']
                }],
                transaction: t
            })
            if (!userRole) {
                message.push("User Role not found");
            }
            else if(userRole.Role.name !== 'teacher' && userRole.Role.name !== 'student') {
                message.push("Role is not student or teacher");
            }
            if (!cLass || !userRole || message.length > 0) {
                await t.rollback();
                return {
                    status: 404,
                    message
                };
            }
            if (userRole.Role.name === 'student') {
                const existed = await StudentClass.findOne({
                    where: {
                        student_id: userID,
                        class_id: classID,
                        left_at: null
                    },
                    transaction: t
                });
                if (existed) {
                    throw Error("Student already in this class");
                }
                const currentStudent = await StudentClass.count({
                    where: {
                        class_id: classID,
                        enrolled_at: {
                            [Op.not]: null
                        },
                        left_at: {
                            [Op.is]: null
                        }
                    },
                    transaction: t
                })
                if (currentStudent < cLass.total_students) {
                    await StudentClass.create({
                        student_id: userID,
                        class_id: classID,
                        enrolled_at: new Date(),
                        left_at: null
                    }, { transaction: t });
                    const lessons = await Lesson.findAll({
                        attributes: ['id'],
                        where: {
                            class_id :classID
                        },
                        transaction: t
                    });
                    if (!lessons.length) {
                        throw Error("Can not add student to this class because not lesson in class");
                    }
                    else {
                        for (const lesson of lessons) {
                            await StudentLesson.create({
                                student_id: userID,
                                lesson_id: lesson.id,
                                status: 'ready'
                            }, { transaction: t })
                        }
                        await t.commit();
                        return {
                            status: 200,
                            message: "Add student to class successfully"
                        }
                    }
                }
                else {
                    throw Error("Can not add student to this class because this class is full");
                }
            }
            else if (userRole.Role.name === 'teacher') {
                await TeacherClass.create({
                    teacher_id: userID,
                    class_id: classID,
                    enrolled_at: new Date(),
                    left_at: null
                }, { transaction: t });
                await t.commit();
                return {
                    status: 200,
                    message: "Add teacher to class successfully"
                }
            }
        } catch (error) {
            await t.rollback();
            return {
                status: 400,
                message: error.message
            };
        }
    },
    removeStudentOrTeacherToClass: async (classID, userID) => {
        const t = await sequelize.transaction();
        try {
            let message = [];
            // Kiểm tra sự tồn tại của class và student
            const cLass = await Class.findByPk(classID, { transaction: t });
            if (!cLass) {
                message.push("Class not found");
            };
            const userRole = await UserRole.findOne({
                where: {
                    user_id: userID,
                },
                include: [{
                    model: Role,
                    required: true,
                    attributes: ['name']
                }],
                transaction: t
            })
            if (!userRole) {
                message.push("User Role not found");
            }
            else if(userRole.Role.name !== 'teacher' && userRole.Role.name !== 'student') {
                message.push("Role is not student or teacher");
            }
            if (!cLass || !userRole || message.length > 0) {
                await t.rollback();
                return {
                    status: 404,
                    message
                };
            }
            if (userRole.Role.name === 'student') {
                const studentInClass = await StudentClass.findOne({
                    where: {
                        class_id: classID,
                        student_id: userID,
                        left_at: {
                            [Op.is]: null
                        },
                    },
                    transaction: t
                });
                if (!studentInClass) {
                    throw new Error("Student is not in class or left from this class")
                }
                // Thêm ngày nghỉ học cho học sinh
                const dateLeft = new Date();
                await studentInClass.update({
                    left_at: dateLeft
                }, { transaction: t });
                await t.commit();
                return {
                    status: 200,
                    message: "Remove student from class success"
                }
            }
            else if (userRole.Role.name === 'teacher') {
                const status = await TeacherClass.destroy({
                    where: {
                        teacher_id: userID,
                        class_id: classID
                    },
                    transaction: t
                });
                if (!status) {
                    throw Error("Teacher is not in this class");
                }
                await t.commit();
                return {
                    status: 200,
                    message: "Remove teacher from class success"
                }
            }
        } catch (error) {
            await t.rollback();
            return {
                status: 400,
                message: error.message
            };
        }
    }
}