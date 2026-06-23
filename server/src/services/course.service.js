const { Course,
    CategoryCourse,
    Parent,
    User,
    Role,
    UserRole,
    CourseClass,
    CourseLesson,
    TuitionFee,
    sequelize } = require("../models/index");
const { transformCourse } = require('../transformers/course.transformer');
const query = (courseQuery={}) => {
    const hasWhere = where => where && Object.keys(where).length > 0;
    return {
            distinct: true,
            ...(courseQuery.limit != null && { limit: courseQuery.limit }),
            ...(courseQuery.offset != null && { offset: courseQuery.offset }),
            ...(courseQuery.course?.attributes?.length && { attributes: courseQuery.course.attributes }),
            order: [
                ...(courseQuery.course?.order || []),
                ...((courseQuery.categoryCourse?.order || []).map(order => [
                    { model: CategoryCourse, as: 'course_in_category' },
                    ...order
                ]))
            ],
            ...(hasWhere(courseQuery.course?.where) && {
                where: courseQuery.course.where
            }),
            include: [
                {
                    model: CategoryCourse,
                    as: 'course_in_category',
                    required: false,
                    attributes: ['name']
                }
            ]
    };
}
module.exports = {
    // Lấy tài khoản khóa học
    /*
        Nếu lấy category_corse_id
        [{
            id: ...,
            name: ...,
            year_course: ...
            ...,
            category_corse: {
                name: ...,
            }

        ]}
        Nếu không lấy category_corse_id
        [{
            id: ...,
            name: ...,
            ...
        ]}
        Courses ban đầu return từ findAll
        [{
            id: ...,
            name: ...,
            year_course: ...
            ...,
            course_in_category: {
                name: ...,
            }
        }]
    */
    getCourses: async (courseQuery = {}) => {
        let rows;
        let count;
        if (courseQuery.limit != null) {
            const result = await Course.findAndCountAll(query(courseQuery));
            rows = result.rows.map(transformCourse);
            count = result.count;
        } else {
            rows = await Course.findAll(query(courseQuery));
            count = rows.length;
            rows = rows.map(transformCourse);
        }
        if (count === 0) {
            return {
                status: 404,
                message: "Courses not found"
            }
        }
        return {
            status: 200,
            data: rows,
            count,
            message: "Courses found"
        };
    },
    getCourse: async (id) => {
        const course = await Course.findByPk(id, query())
        if (!course) {
            return {
                status: 404,
                message: "Course not found"
            }
        }
        return {
            status: 200,
            data: transformCourse(course),
            message: "Course found"
        }
    },
    createCourse: async (data) => {
        const t = await sequelize.transaction();
        try {
            const role = await Role.findOne({
                where: {
                    name: 'course',
                },
                transaction: t
            });
            if (!role) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Role course not found"
                }
            }
            // Thêm thông tin user Course
            const course = await Course.create({
                name: data.name,
                year_course: data.year_course,
                total_lessons: data.total_lessons,
                listed_price: data.listed_price,
                description: data.description,
                thumbnail_link: data.thumbnail_link,
                thumbnail_id: data.thumbnail_id,
                category_course_id: data.category_course_id ?? null,
                status: data.status || 'private',
                discount: data.discount || 0,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            await t.commit();
            const result = await Course.findByPk(course.id, query());
            return {
                status: 201,
                data: transformCourse(result),
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
    updateCourse: async (data, id) => {
        const courseData = {};
        const t = await sequelize.transaction();
        try {
            const course = await Course.findByPk(id, { transaction: t });
            if (!course) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Course not found"
                };
            };
            if ("name" in data) {
              courseData.name = data.name;
            };
            if ("year_course" in data) {
              courseData.year_course = data.year_course;
            };
            if ("description" in data) {
              courseData.description = data.description;
            };
            if ("thumbnail_link" in data) {
              courseData.thumbnail_link = data.thumbnail_link;
            };
            if ("thumbnail_id" in data) {
              courseData.thumbnail_id = data.thumbnail_id;
            };
            if ("category_course_id" in data) {
              courseData.category_course_id = data.category_course_id;
            };
            if ("status" in data) {
              courseData.status = data.status;
            };
            await Course.update(courseData,
            {
                where: { id },
                transaction: t
            });
            await t.commit();
            const result = await Course.findByPk(id, query());
            return {
                status: 200,
                data: transformCourse(result),
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
}