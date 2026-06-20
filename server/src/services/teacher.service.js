const { Teacher,
    User,
    Role,
    UserRole,
    MonthlyTeacherSalary,
    Assignment,
    sequelize } = require("../models/index");
const { hashPassword } = require("../utilities/hashing")
const teacherInclude = [{
    model: Teacher,
    required: true
}];
module.exports = {
    // Lấy tài khoản học sinh
    getTeachers: async ({ attributes, sort, order, where, limit, offset }) => {
        const query = {
            order: [[sort, order]],
            where,
            limit,
            offset,
            include: teacherInclude
        };
        if (attributes) {
            query.attributes = attributes.filter(
                attribute => attribute !== "password"
            );
        } else {
            query.attributes = {
                exclude: ["password"]
            };
        }
        const teachers = await User.findAndCountAll(query);
        if (teachers.count === 0) {
            return {
                status: 404,
                message: "Teachers not found"
            }
        }
        return {
            status: 200,
            data: teachers.rows,
            count: teachers.count,
            message: "Teachers found"
        };
    },
    getTeacher: async (id) => {
        const teacher = await User.findByPk(id, {
            attributes: {
                exclude: ["password"]
            },
            include: teacherInclude
        })
        if (!teacher) {
            return {
                status: 404,
                message: "Teacher not found"
            }
        }
        return {
            status: 200,
            data: teacher,
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
                balance: data.balance || 0,
                description: data.description??null,
                thumbnail_link: data.thumbnail_link??null,
                thumbnail_id: data.thumbnail_id??null,
                status: data.status || "private",
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            await t.commit();
            const result = await User.findByPk(user.id, {
                attributes: {
                    exclude: ["password"]
                },
                include: teacherInclude
            });

            return {
                status: 201,
                data: result,
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
        const { description, thumbnail_link, thumbnail_id, balance, status, ...userData } = data;
        const teacherData = {};
        if("description" in data){
            teacherData.description = description
        }
        if("thumbnail_link" in data){
            teacherData.thumbnail_link = thumbnail_link
        }
        if("thumbnail_id" in data) {
            teacherData.thumbnail_id = thumbnail_id
        }
        if("balance" in data){
            teacherData.balance = balance
        }
        if("status" in data){
            teacherData.status = status
        }
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
            await User.update(userData,
                {
                    where: { id },
                    transaction: t
                });
            if (Object.keys(teacherData).length!==0) {
                await Teacher.update(teacherData,
                    {
                        where: { id },
                        transaction: t
                    });
            };
            await t.commit();
            const result = await User.findByPk(id, {
                attributes: {
                    exclude: ["password"]
                },
                include: teacherInclude
            });
            return {
                status: 200,
                data: result,
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
            await MonthlyTeacherSalary.destroy({
                where: {
                    teacher_id: id
                },
                transaction: t
            });
            await Assignment.destroy({
                where: {
                    teacher_id: id
                },
                transaction: t
            })
            // Xóa role teacher
            await UserRole.destroy({
                where: {
                    user_id: id
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
            if(!status){
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