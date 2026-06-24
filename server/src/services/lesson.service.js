const { Lesson, Class,
    sequelize } = require("../models/index");
const { transformLesson } = require('../transformers/lesson.transformer');
const query = (lessonQuery = {}) => {
    const hasWhere = where => where && Object.keys(where).length > 0;
    return {
        distinct: true,
        ...(lessonQuery.limit != null && { limit: lessonQuery.limit }),
        ...(lessonQuery.offset != null && { offset: lessonQuery.offset }),
        ...(lessonQuery.lesson?.attributes?.length && { attributes: lessonQuery.lesson.attributes }),
        order: [
            ...(lessonQuery.lesson?.order || []),
        ],
        ...(hasWhere(lessonQuery.lesson?.where) && {
            where: lessonQuery.lesson.where
        }),
        include: [
            {
                model: Class,
                required: true,
                attributes: ['id', 'name'],
            }
        ]
    };
}
module.exports = {
    // Lấy danh sách buổi học
    /*
        [{
            id: ...,
            name: ...,
            ...
            class_id: ...
            class_name: ...

        ]}
    */
    getLessons: async (lessonQuery = {}) => {
        let rows;
        let count;
        if (lessonQuery.limit != null) {
            const result = await Lesson.findAndCountAll(query(lessonQuery));
            rows = result.rows.map(transformLesson);
            count = result.count;
        } else {
            rows = await Lesson.findAll(query(lessonQuery));
            count = rows.length;
            rows = rows.map(transformLesson);
        }
        if (count === 0) {
            return {
                status: 404,
                message: "Lessons not found"
            }
        }
        return {
            status: 200,
            data: rows,
            count,
            message: "Lessons found"
        };
    },
    getLesson: async (id) => {
        const lesson = await Lesson.findByPk(id, query())
        if (!lesson) {
            return {
                status: 404,
                message: "Lesson not found"
            }
        }
        return {
            status: 200,
            data: transformLesson(lesson),
            message: "Lesson found"
        }
    },
    createLesson: async (data) => {
        const t = await sequelize.transaction();
        try {
            // Thêm thông tin user
            const user = await Lesson.create({
                name: data.name,
                start: new Date(data.start),
                end: new Date(data.end),
                description: data.description ?? null,
                listed_price: data.listed_price ?? 0,
                class_id: data.class_id,
                address: data.address ?? null,
                status: data.status || 'not_canceled',
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            await t.commit();
            const result = await Lesson.findByPk(user.id, query());
            return {
                status: 201,
                data: transformLesson(result),
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
    updateLesson: async (data, id) => {
        const lessonData = {};
        const t = await sequelize.transaction();
        try {
            const lesson = await Lesson.findByPk(id, { transaction: t });
            if (!lesson) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Lesson not found"
                };
            };
            if ('name' in data) {
                lessonData.name = data.name;
            }
            if ('start' in data) {
                lessonData.start = data.start;
                if ("end" in data) {
                    if (new Date(data.end) >= new Date(data.start)) {
                        lessonData.end = new Date(data.end);
                    }
                    else {
                        throw new Error("Updated End date must be greater or eqeal updated Start date")
                    }
                };
            }
            else {
                if ("end" in data) {
                    if (new Date(data.end) >= lesson.start) {
                        lessonData.end = new Date(data.end);
                    }
                    else {
                        throw new Error("Updated End date must be greater or eqeal current Start date")
                    }
                };
            }
            if ('description' in data) {
                lessonData.description = data.description;
            }
            if ('class_id' in data) {
                lessonData.classs_id = data.classs_id;
            }
            if ('status' in data) {
                lessonData.status = data.status;
            }
            if (Object.keys(lessonData).length) {
                await lesson.update(lessonData,
                    {
                        transaction: t
                    });
            }
            await t.commit();
            const result = await Lesson.findByPk(id, query());
            return {
                status: 200,
                data: transformLesson(result),
                message: "Update success"
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