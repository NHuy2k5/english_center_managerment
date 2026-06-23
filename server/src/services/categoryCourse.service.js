const {CategoryCourse, sequelize } = require("../models/index");
const query = (categoryCourseQuery={}) => {
    const hasWhere = where => where && Object.keys(where).length > 0;
    return {
            ...(categoryCourseQuery.limit != null && { limit: categoryCourseQuery.limit }),
            ...(categoryCourseQuery.offset != null && { offset: categoryCourseQuery.offset }),
            ...(categoryCourseQuery.categoryCourse?.attributes?.length && { attributes: categoryCourseQuery.categoryCourse.attributes }),
            order: [
                ...(categoryCourseQuery.categoryCourse?.order || [])
            ],
            ...(hasWhere(categoryCourseQuery.categoryCourse?.where) && {
                where: categoryCourseQuery.categoryCourse.where
            }),
    };
}
module.exports = {
    // Lấy danh mục khóa học
    /*
        [{
            id: ...,
            name: ...,
        ]}
    */
    getCategoryCourses: async (categoryCourseQuery = {}) => {
        let rows;
        let count;
        if (categoryCourseQuery.limit != null) {
            const result = await CategoryCourse.findAndCountAll(query(categoryCourseQuery));
            rows = result.rows;
            count = result.count;
        } else {
            rows = await CategoryCourse.findAll(query(categoryCourseQuery));
            count = rows.length;
        }
        if (count === 0) {
            return {
                status: 404,
                message: "Category courses not found"
            }
        }
        return {
            status: 200,
            data: rows,
            count,
            message: "Category courses found"
        };
    },
    getCategoryCourse: async (id) => {
        const categoryCourse = await CategoryCourse.findByPk(id, query())
        if (!categoryCourse) {
            return {
                status: 404,
                message: "Category Course not found"
            }
        }
        return {
            status: 200,
            data: categoryCourse,
            message: "Category Course found"
        }
    },
    createCategoryCourse: async (data) => {
        const t = await sequelize.transaction();
        try {
            // Thêm thông tin CategoryCourse
            const categoryCourse = await CategoryCourse.create({
                id: data.id,
                name: data.name,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            await t.commit();
            const result = await CategoryCourse.findByPk(categoryCourse.id, query());
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
    updateCategoryCourse: async (data, id) => {
        const t = await sequelize.transaction();
        try {
            const categoryCourse = await CategoryCourse.findByPk(id, { transaction: t });
            if (!categoryCourse) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Category Course not found"
                };
            };
            if ("name" in data) {
                await CategoryCourse.update({ data },
                    {
                        where: { id },
                        transaction: t
                    });
            };
            await t.commit();
            const result = await CategoryCourse.findByPk(id, query());
            return {
                status: 200,
                data: transformCategoryCourse(result),
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
    deleteCategoryCourse: async (id) => {
        const t = await sequelize.transaction();
        try {
            const categoryCourse = await CategoryCourse.findByPk(id, { transaction: t });
            if (!categoryCourse) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Category Course not found"
                };
            };
            // Xóa danh mục khóa học
            const status = await CategoryCourse.destroy({
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