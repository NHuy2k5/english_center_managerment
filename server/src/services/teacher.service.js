const { Teacher,
    MonthlyTeacherSalary,
    TeacherClass,
    Assignment,
    User,
    Role,
    UserRole,
    sequelize } = require("../models/index");
const { hashPassword } = require("../utilities/hashing")
const { transformTeacher } = require("../transformers/teacher.transformer");
const query = (teacherQuery = {}) => {
    const hasWhere = where => where && Object.keys(where).length > 0;
    return {
        paranoid: false,
        distinct: true,
        ...(teacherQuery.limit != null && { limit: teacherQuery.limit }),
        ...(teacherQuery.offset != null && { offset: teacherQuery.offset }),
        ...(teacherQuery.teacher?.attributes?.length && { attributes: teacherQuery.teacher.attributes }),
        order: [
            ...(teacherQuery.teacher?.order || []),
            ...((teacherQuery.user?.order || []).map(order => [
                { model: User, as: 'teacher_user' },
                ...order
            ]))
        ],
        ...(hasWhere(teacherQuery.teacher?.where) && {
            where: teacherQuery.teacher.where
        }),
        include: [
            {
                model: User,
                as: 'teacher_user',
                required: true,
                ...(teacherQuery.user?.attributes?.length ? { attributes: teacherQuery.user.attributes } : { attributes: { exclude: ['password'] } }),
                ...(hasWhere(teacherQuery.user?.where) && {
                    where: teacherQuery.user.where
                })
            }
        ]
    };
}
module.exports = {
    // Lấy tài khoản giáo viên
    /*
        Nếu không lấy parent_id
        [{
            id: ...,
            user_name: ...,
            ...
        ]}
        Teachers ban đầu return từ findAll
        [{
            id: ...,
            teacher_user: {
                id: ...,
                full_name: ...
                ...
            }
        }]
    */
    getTeachers: async (teacherQuery = {}) => {
        let rows;
        let count;
        if (teacherQuery.limit != null) {
            const result = await Teacher.findAndCountAll(query(teacherQuery));
            rows = result.rows.map(transformTeacher);
            count = result.count;
        } else {
            rows = await Teacher.findAll(query(teacherQuery));
            count = rows.length;
            rows = rows.map(transformTeacher);
        }
        if (count === 0) {
            return {
                status: 404,
                message: "Teachers not found"
            }
        }
        return {
            status: 200,
            data: rows,
            count,
            message: "Teachers found"
        };
    },
    getTeacher: async (id) => {
        const teacher = await Teacher.findByPk(id, query())
        if (!teacher) {
            return {
                status: 404,
                message: "Teacher not found"
            }
        }
        return {
            status: 200,
            data: transformTeacher(teacher),
            message: "Teacher found"
        }
    },
    createTeacher: async (data) => {
        const t = await sequelize.transaction();
        try {
            const role = await Role.findOne({
                where: {
                    name: 'teacher',
                },
                transaction: t
            });
            if (!role) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Role teacher not found"
                }
            }
            // Thêm thông tin user
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
            // Thêm role teacher
            await UserRole.create({
                user_id: user.id,
                role_id: role.id,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            // Thêm thông tin Teacher
            await Teacher.create({
                id: user.id,
                balance: data.balance ?? 0,
                description: data.description ?? null,
                thumbnail_link: data.thumbnail_link ?? null,
                thumbnail_id: data.thumbnail_id ?? null,
                status: data.status ?? 'private',
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            await t.commit();
            const result = await Teacher.findByPk(user.id, query());

            return {
                status: 201,
                data: transformTeacher(result),
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
    updateTeacher: async (data, id) => {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        if (data.birthday) {
            data.birthday = new Date(data.birthday);
        }
        const { balance, description, thumbnail_link, thumbnail_id, status, ...userData } = data;
        const teacherData = {};
        const t = await sequelize.transaction();
        try {
            const teacher = await Teacher.findByPk(id, { transaction: t });
            if (!teacher) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Teacher not found"
                };
            };
            if (Object.keys(userData).length) {
                await User.update(userData,
                    {
                        where: { id },
                        transaction: t
                    });
            };
            if ("description" in data) {
                teacherData.description = description;
            }
            if ("thumbnail_link" in data) {
                teacherData.thumbnail_link = thumbnail_link;
            };
            if ("balance" in data) {
                teacherData.balance = balance;
            }
            if ("thumbnail_id" in data) {
                teacherData.thumbnail_id = thumbnail_id;
            }
            if ("status" in data) {
                teacherData.status = status;
            }
            if(Object.keys(teacherData).length){
                await Teacher.update(teacherData,
                    {
                        where: { id },
                        transaction: t
                    });
            }
            await t.commit();
            const result = await Teacher.findByPk(id, query());
            return {
                status: 200,
                data: transformTeacher(result),
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
    deleteTeacher: async (id) => {
        const t = await sequelize.transaction();
        try {
            const teacher = await Teacher.findByPk(id, { transaction: t });
            if (!teacher) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Teacher not found"
                };
            };
            await Assignment.destroy({
                where: {
                    teacher_id: id
                },
                transaction: t
            });
            // Xóa giáo viên ở teacher_class, hàm trả về số lượng bản ghi bị xóa, nếu không có thì trả về 0
            await TeacherClass.destroy({
                where: {
                    teacher_id: id
                },
                transaction: t
            })
            // Xóa giáo viên ở monthly_teacher_salary
            await MonthlyTeacherSalary.destroy({
                where: {
                    teacher_id: id
                },
                transaction: t
            })
            // Xóa role teacher
            const teacherRole = await Role.findOne({
                where: {
                    name: "teacher"
                },
                transaction: t
            });
            if(!teacherRole){
                await t.rollback();
                return {
                    status: 404,
                    message: 'Role teacher not found'
                }
            }
            await UserRole.destroy({
                where: {
                    user_id: id,
                    role_id: teacherRole.id
                },
                transaction: t
            });
            // Xóa giáo viên
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