const { Student,
    Parent,
    User,
    Role,
    UserRole,
    StudentClass,
    StudentLesson,
    TuitionFee,
    sequelize } = require("../models/index");
const { hashPassword } = require("../utilities/hashing")
const studentInclude = [{
    model: Student,
    required: true,
    include: [{
        model: Parent
    }]
}];
module.exports = {
    // Lấy tài khoản học sinh
    getStudents: async ({ attributes, sort, order, where, limit, offset }) => {
        const query = {
            order: [[sort, order]],
            where,
            limit,
            offset,
            include: studentInclude
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
        const students = await User.findAndCountAll(query);
        if (students.count === 0) {
            return {
                status: 404,
                message: "Students not found"
            }
        }
        return {
            status: 200,
            data: students.rows,
            count: students.count,
            message: "Students found"
        };
    },
    getStudent: async (id) => {
        const student = await User.findByPk(id, {
            attributes: {
                exclude: ["password"]
            },
            include: studentInclude
        })
        if (!student) {
            return {
                status: 404,
                message: "Student not found"
            }
        }
        return {
            status: 200,
            data: student,
            message: "Student found"
        }
    },
    createStudent: async (data) => {
        const t = await sequelize.transaction();
        try {
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
            const result = await User.findByPk(user.id, {
                attributes: {
                    exclude: ["password"]
                },
                include: studentInclude
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
            await User.update(userData,
                {
                    where: { id },
                    transaction: t
                });
            if ("parent_id" in data) {
                await Student.update({ parent_id },
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
                include: studentInclude
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
            // Xóa role student
            await UserRole.destroy({
                where: {
                    user_id: id
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