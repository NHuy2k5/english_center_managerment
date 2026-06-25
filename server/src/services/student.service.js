const { Student,
    Parent,
    User,
    Role,
    UserRole,
    StudentClass,
    StudentLesson,
    TuitionFee,
    sequelize } = require("../models/index");
const { where, Op } = require("sequelize");
const { hashPassword } = require("../utilities/hashing")
const { transformStudent } = require('../transformers/student.transformer');
const query = (studentQuery = {}) => {
    const hasWhere = where => where && Object.keys(where).length > 0;
    return {
        paranoid: false,
        distinct: true,
        ...(studentQuery.limit != null && { limit: studentQuery.limit }),
        ...(studentQuery.offset != null && { offset: studentQuery.offset }),
        ...(studentQuery.student?.attributes?.length && { attributes: studentQuery.student.attributes }),
        order: [
            ...(studentQuery.student?.order || []),
            ...((studentQuery.user?.order || []).map(order => [
                { model: User, as: 'student_user' },
                ...order
            ]))
        ],
        ...(hasWhere(studentQuery.student?.where) && {
            where: studentQuery.student.where
        }),
        include: [
            {
                model: User,
                as: 'student_user',
                required: true,
                ...(studentQuery.user?.attributes?.length ? { attributes: studentQuery.user.attributes } : { attributes: { exclude: ['password'] } }),
                ...(hasWhere(studentQuery.user?.where) && {
                    where: studentQuery.user.where
                })
            },
            {
                model: Parent,
                required: false,
                attributes: ['id', 'balance'],
                include: [{
                    model: User,
                    as: 'parent_user',
                    attributes: ["full_name", "avatar_id", "avatar_link"]
                }]
            }
        ]
    };
}
module.exports = {
    // Lấy tài khoản học sinh
    /*
        Nếu lấy parent_id
        [{
            id: ...,
            user_name: ...,
            ...
            parent: {
                id: ...,
                full_name: ...,
                avatar_link: ...,
                avatar_id: ...
            }

        ]}
        Nếu không lấy parent_id
        [{
            id: ...,
            user_name: ...,
            ...
        ]}
        Students ban đầu return từ findAll
        [{
            id: ...,
            student_user: {
                id: ...,
                full_name: ...
                ...
            },
            Parent: {
                id: ...,
                parent_user: {
                    full_name: ...,
                    avatar_link: ...,
                    avatar_id: ...
                }
            }
        }]
    */
    getStudents: async (studentQuery = {}) => {
        let rows;
        let count;
        if (studentQuery.limit != null) {
            const result = await Student.findAndCountAll(query(studentQuery));
            rows = result.rows.map(transformStudent);
            count = result.count;
        } else {
            rows = await Student.findAll(query(studentQuery));
            count = rows.length;
            rows = rows.map(transformStudent);
        }
        if (count === 0) {
            return {
                status: 404,
                message: "Students not found"
            }
        }
        return {
            status: 200,
            data: rows,
            count,
            message: "Students found"
        };
    },
    getStudent: async (id) => {
        const student = await Student.findByPk(id, query())
        if (!student) {
            return {
                status: 404,
                message: "Student not found"
            }
        }
        return {
            status: 200,
            data: transformStudent(student),
            message: "Student found"
        }
    },
    createStudent: async (data) => {
        const t = await sequelize.transaction();
        try {
            console.log('1. Finding role...');
            const role = await Role.findOne({
                where: {
                    name: 'student',
                },
                transaction: t
            });
            if (!role) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Role student not found"
                }
            }
            console.log('2. Role found:', role?.id);
            // Thêm thông tin user
            console.log('3. Creating user...');
            const user = await User.create({
                user_name: data.user_name,
                phone: data.phone,
                email: data.email,
                full_name: data.full_name,
                birthday: new Date(data.birthday),
                address: data.address,
                sex: data.sex,
                password: await hashPassword(data.password),
                avatar_link: data.avatar_link ?? null,
                avatar_id: data.avatar_id ?? null,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            console.log('4. User created:', user?.id);
            // Thêm role student
            await UserRole.create({
                user_id: user.id,
                role_id: role.id,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            // Thêm thông tin Student
            await Student.create({
                id: user.id,
                parent_id: data.parent_id ?? null,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            await t.commit();
            const result = await Student.findByPk(user.id, query());

            return {
                status: 201,
                // data: transformStudent(result),
                message: "Create success"
            };
        } catch (error) {
            await t.rollback();
            console.error('FULL ERROR:', error);
            return {
                status: 400,
                message: error.message
            };
        }
    },
    updateStudent: async (data, id) => {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        if (data.birthday) {
            data.birthday = new Date(data.birthday);
        }
        const { parent_id, ...userData } = data;
        const t = await sequelize.transaction();
        try {
            const student = await Student.findByPk(id, { transaction: t });
            if (!student) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Student not found"
                };
            };
            if (Object.keys(userData).length) {
                await User.update(userData,
                    {
                        where: { id },
                        transaction: t,
                        validate: false
                    });
            };
            if ("parent_id" in data) {
                await Student.update({ parent_id },
                    {
                        where: { id },
                        transaction: t,
                        validate: false
                    });
            };
            await t.commit();
            const result = await Student.findByPk(id, query());
            return {
                status: 200,
                data: transformStudent(result),
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
    deleteStudent: async (id) => {
        const t = await sequelize.transaction();
        try {
            const student = await Student.findByPk(id, { transaction: t });
            if (!student) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Student not found"
                };
            };
            const studentRole = await Role.findOne({ where: { name: "student" }, transaction: t });

            await UserRole.destroy({
                where: {
                    user_id: id,
                    role_id: studentRole.id
                },
                transaction: t
            });
            if (!studentRole){
                await t.rollback();
                return {
                    status: 404,
                    message: "Role student not found"
                };
            }
            await TuitionFee.destroy({
                where: {
                    student_id: id
                },
                transaction: t
            });
            // Xóa học sinh ở student_class, hàm trả về số lượng bản ghi bị xóa, nếu không có thì trả về 0
            await StudentClass.destroy({
                where: {
                    student_id: id
                },
                transaction: t
            })
            // Xóa học sinh ở student_lesson
            await StudentLesson.destroy({
                where: {
                    student_id: id
                },
                transaction: t
            });

            await UserRole.destroy({
                where: {
                    user_id: id,
                    role_id: studentRole.id
                },
                transaction: t
            });
            // Xóa học sinh
            const status = await User.destroy({
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
}