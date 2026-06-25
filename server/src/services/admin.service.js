const { Admin,
    User,
    Role,
    UserRole,
    sequelize } = require("../models/index");
const { Op } = require("sequelize");
const { hashPassword } = require("../utilities/hashing")
const { transformAdmin } = require('../transformers/admin.transformer');
const query = (adminQuery = {}) => {
    const hasWhere = where => where && Object.keys(where).length > 0;
    return {
        paranoid: false,
        distinct: true,
        ...(adminQuery.limit != null && { limit: adminQuery.limit }),
        ...(adminQuery.offset != null && { offset: adminQuery.offset }),
        ...(adminQuery.admin?.attributes?.length && { attributes: adminQuery.admin.attributes }),
        order: [
            ...(adminQuery.admin?.order || []),
            ...((adminQuery.user?.order || []).map(order => [
                { model: User, as: 'admin_user' },
                ...order
            ]))
        ],
        ...(hasWhere(adminQuery.admin?.where) && {
            where: adminQuery.admin.where
        }),
        include: [
            {
                model: User,
                as: 'admin_user',
                required: true,
                ...(adminQuery.user?.attributes?.length ? { attributes: adminQuery.user.attributes } : { attributes: { exclude: ['password'] } }),
                ...(hasWhere(adminQuery.user?.where) && {
                    where: adminQuery.user.where
                })
            },
        ]
    };
}
module.exports = {
    // Lấy tài khoản admin
    /*
        Nếu không lấy parent_id
        [{
            id: ...,
            user_name: ...,
            ...
        ]}
        Admins ban đầu return từ findAll
        [{
            id: ...,
            admin_user: {
                id: ...,
                full_name: ...
                ...
            },
        }]
    */
    getAdmins: async (adminQuery = {}) => {
        let rows;
        let count;
        if (adminQuery.limit != null) {
            const result = await Admin.findAndCountAll(query(adminQuery));
            rows = result.rows.map(transformAdmin);
            count = result.count;
        } else {
            rows = await Admin.findAll(query(adminQuery));
            count = rows.length;
            rows = rows.map(transformAdmin);
        }
        if (count === 0) {
            return {
                status: 404,
                message: "Admins not found"
            }
        }
        return {
            status: 200,
            data: rows,
            count,
            message: "Admins found"
        };
    },
    getAdmin: async (id) => {
        const admin = await Admin.findByPk(id, query())
        if (!admin) {
            return {
                status: 404,
                message: "Admin not found"
            }
        }
        return {
            status: 200,
            data: transformAdmin(admin),
            message: "Admin found"
        }
    },
    createAdmin: async (data) => {
        const t = await sequelize.transaction();
        try {
            const role = await Role.findOne({
                where: {
                    name: 'admin',
                },
                transaction: t
            });
            if (!role) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Role admin not found"
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
            // Thêm role admin
            await UserRole.create({
                user_id: user.id,
                role_id: role.id,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            // Thêm thông tin Admin
            await Admin.create({
                id: user.id,
                config: data.config ?? {},
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            await t.commit();
            const result = await Admin.findByPk(user.id, query());

            return {
                status: 201,
                data: transformAdmin(result),
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
    updateAdmin: async (data, id) => {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        if (data.birthday) {
            data.birthday = new Date(data.birthday);
        }
        const { config, ...userData } = data;
        const t = await sequelize.transaction();
        try {
            const admin = await Admin.findByPk(id, { transaction: t });
            if (!admin) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Admin not found"
                };
            };
            if (Object.keys(userData).length) {
                await User.update(userData,
                    {
                        where: { id },
                        transaction: t
                    });
            };
            if ("config" in data) {
                await Admin.update({ config },
                    {
                        where: { id },
                        transaction: t
                    });
            };
            await t.commit();
            const result = await Admin.findByPk(id, query());
            return {
                status: 200,
                data: transformAdmin(result),
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
    deleteAdmin: async (id) => {
        const t = await sequelize.transaction();
        try {
            const adminCount = await Admin.count({ transaction: t });
            if (adminCount <= 1) {
                await t.rollback();
                return { status: 400, message: "Cannot delete the last admin" };
            }
            const admin = await Admin.findByPk(id, { transaction: t });
            if (!admin) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Admin not found"
                };
            };
            // Xóa role admin
            const adminRole = await Role.findOne({ 
                where: { name: "admin" },
                transaction: t
             });

            if (!adminRole) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Role admin not found"
                };
            }
            await UserRole.destroy({
                where: {
                    user_id: id,
                    role_id: adminRole.id
                },
                transaction: t
            });
            // Xóa admin
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