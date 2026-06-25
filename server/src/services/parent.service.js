const { Student,
    Parent,
    User,
    Role,
    UserRole,
    ParentClass,
    ParentLesson,
    TuitionFee,
    sequelize } = require("../models/index");
const { hashPassword } = require("../utilities/hashing")
const { transformParent } = require('../transformers/parent.transformer');
const query = (parentQuery={}) => {
    const hasWhere = where => where && Object.keys(where).length > 0;
    return {
            paranoid: false,
            distinct: true,
            ...(parentQuery.limit != null && { limit: parentQuery.limit }),
            ...(parentQuery.offset != null && { offset: parentQuery.offset }),
            ...(parentQuery.parent?.attributes?.length && { attributes: parentQuery.parent.attributes }),
            order: [
                ...(parentQuery.parent?.order || []),
                ...((parentQuery.user?.order || []).map(order => [
                    { model: User, as: 'parent_user' },
                    ...order
                ]))
            ],
            ...(hasWhere(parentQuery.parent?.where) && {
                where: parentQuery.parent.where
            }),
            include: [
                {
                    model: User,
                    as: 'parent_user',
                    required: true,
                    ...(parentQuery.user?.attributes?.length ? { attributes: parentQuery.user.attributes } : { attributes: { exclude: ['password'] } }),
                    ...(hasWhere(parentQuery.user?.where) && {
                        where: parentQuery.user.where
                    })
                },
                {
                    model: Student,
                    required: false,
                    attributes: ['id'],
                    include: [{
                        model: User,
                        as: 'student_user',
                        attributes: ["id", "full_name", "avatar_id", "avatar_link"]
                    }]
                }
            ]
    };
}
module.exports = {
    // Lấy tài khoản phụ huynh
    /*
        [{
            id: ...,
            user_name: ...,
            ...
            students:[
            {
                id: ...,
                full_name: ...,
                avatar_link: ...,
                avatar_id: ...
            }
            ], ...
        ]}
        Parents ban đầu return từ findAll
        [{
            id: ...,
            parent_user: {
                id: ...,
                full_name: ...
                ...
            },
            Student: [ 
            {
                id: ...,
                student_user: {
                    full_name: ...,
                    avatar_link: ...,
                    avatar_id: ...
                }
            }
            ]
        }]
    */
    getParents: async (parentQuery = {}) => {
        let rows;
        let count;
        if (parentQuery.limit != null) {
            const result = await Parent.findAndCountAll(query(parentQuery));
            rows = result.rows.map(transformParent);
            count = result.count;
        } else {
            rows = await Parent.findAll(query(parentQuery));
            count = rows.length;
            rows = rows.map(transformParent);
        }
        if (count === 0) {
            return {
                status: 404,
                message: "Parents not found"
            }
        }
        return {
            status: 200,
            data: rows,
            count,
            message: "Parents found"
        };
    },
    getParent: async (id) => {
        const parent = await Parent.findByPk(id, query())
        if (!parent) {
            return {
                status: 404,
                message: "Parent not found"
            }
        }
        return {
            status: 200,
            data: transformParent(parent),
            message: "Parent found"
        }
    },
    createParent: async (data) => {
        const t = await sequelize.transaction();
        try {
            const role = await Role.findOne({
                where: {
                    name: 'parent',
                },
                transaction: t
            });
            if (!role) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Role parent not found"
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
            // Thêm role parent
            await UserRole.create({
                user_id: user.id,
                role_id: role.id,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            // Thêm thông tin Parent
            await Parent.create({
                id: user.id,
                balance: data.balance ?? 0,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            await t.commit();
            const result = await Parent.findByPk(user.id, query());

            return {
                status: 201,
                data: transformParent(result),
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
    updateParent: async (data, id) => {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        if (data.birthday) {
            data.birthday = new Date(data.birthday);
        }
        const { balance, ...userData } = data;
        const t = await sequelize.transaction();
        try {
            const parent = await Parent.findByPk(id, { transaction: t });
            if (!parent) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Parent not found"
                };
            };
            if(Object.keys(userData).length){
                await User.update(userData,
                    {
                        where: { id },
                        transaction: t
                    });
            };
            if ("balance" in data) {
                await Parent.update({ balance },
                    {
                        where: { id },
                        transaction: t
                    });
            };
            await t.commit();
            const result = await Parent.findByPk(id, query());
            return {
                status: 200,
                data: transformParent(result),
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
    deleteParent: async (id) => {
        const t = await sequelize.transaction();
        try {
            const parent = await Parent.findByPk(id, { transaction: t });
            if (!parent) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Parent not found"
                };
            };
            // Gỡ phụ huynh ra khỏi học sinh
            await Student.update({
                parent_id: null,
            },{
                where: {
                    parent_id: id
                }
            }, {transaction: t})
            // Xóa role parent
            const parentRole = await Role.findOne({
                where: {
                    name: "parent"
                },
                transaction: t
            });
            if(!parentRole){
                await t.rollback();
                return {
                    status: 404,
                    message: "Role parent is not found"
                }
            }
            await UserRole.destroy({
                where: {
                    user_id: id,
                    role_id: parentRole.id
                },
                transaction: t
            });
            // Xóa phụ huynh
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