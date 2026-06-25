const { Registration, CategoryCourse, sequelize } = require("../models/index");
const { transformRegistration } = require('../transformers/registration.transformer');
const query = (registrationQuery={}) => {
    const hasWhere = where => where && Object.keys(where).length > 0;
    return {
            paranoid: false,
            distinct: true,
            ...(registrationQuery.limit != null && { limit: registrationQuery.limit }),
            ...(registrationQuery.offset != null && { offset: registrationQuery.offset }),
            ...(registrationQuery.registration?.attributes?.length && { attributes: registrationQuery.registration.attributes }),
            order: [
                ...(registrationQuery.registration?.order || [])
            ],
            ...(hasWhere(registrationQuery.registration?.where) && {
                where: registrationQuery.registration.where
            }),
            include: [
                // {
                //     model: User,
                //     as: 'registration_user',
                //     required: true,
                //     ...(registrationQuery.user?.attributes?.length ? { attributes: registrationQuery.user.attributes } : { attributes: { exclude: ['password'] } }),
                //     ...(hasWhere(registrationQuery.user?.where) && {
                //         where: registrationQuery.user.where
                //     })
                // },
                {
                    model: CategoryCourse,
                    required: false,
                    attributes: ['id', 'name']
                }
            ]
    };
}
module.exports = {
    // Lấy thông tin đăng ký
    /*
        Nếu lấy parent_id
        [{
            id: ...,
            full_name: ...,
            ...
            category_course: {
                id: ...,
                name: ...
            }

        ]}
        Registrations ban đầu return từ findAll
        [{
            id: ...,
            full_name: ...,
            ...
            CategoryCourse: {
                id: ...,
                name: ...,
            }
        }]
    */
    getRegistrations: async (registrationQuery = {}) => {
        let rows;
        let count;
        if (registrationQuery.limit != null) {
            const result = await Registration.findAndCountAll(query(registrationQuery));
            rows = result.rows.map(transformRegistration);
            count = result.count;
        } else {
            rows = await Registration.findAll(query(registrationQuery));
            count = rows.length;
            rows = rows.map(transformRegistration);
        }
        if (count === 0) {
            return {
                status: 404,
                message: "Registrations not found"
            }
        }
        return {
            status: 200,
            data: rows,
            count,
            message: "Registrations found"
        };
    },
    getRegistration: async (id) => {
        const registration = await Registration.findByPk(id, query())
        if (!registration) {
            return {
                status: 404,
                message: "Registration not found"
            }
        }
        return {
            status: 200,
            data: transformRegistration(registration),
            message: "Registration found"
        }
    },
    createRegistration: async (data) => {
        try {
            // Thêm thông tin đăng ký tư vấn
            const registration = await Registration.create({
                phone: data.phone,
                email: data.email,
                full_name: data.full_name,
                address: data.address,
                category_course_id: data.category_course_id,
                created_at: new Date(),
                updated_at: new Date()
            });
            const result = await Registration.findByPk(registration.id, query());
            return {
                status: 201,
                data: transformRegistration(result),
                message: "Create success"
            };
        } catch (error) {
            return {
                status: 400,
                message: error.message
            };
        }
    },
    deleteRegistration: async (id) => {
        const t = await sequelize.transaction();
        try {
            const registration = await Registration.findByPk(id, { transaction: t });
            if (!registration) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Registration not found"
                };
            };
            // Xóa thông tin đăng ký
            const status = await Registration.destroy({
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