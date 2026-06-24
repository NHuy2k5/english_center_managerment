const { ref, object, string, number, date } = require("yup");
const { Course } = require("../models/index");
const createCourseSchema = object({
    body: object({
        name: string().required(),
        year_course: number().required(),
        description: string().notRequired(),
        thumbnail_link: string().notRequired(),
        thumbnail_id: string().notRequired(),
        category_course_id: number().notRequired(),
        status: string().required().oneOf(['private', 'public', 'closed'], 'Status of course must be private, public, closed')
    })
});
const updateCourseSchema = object({
    body: object({
        name: string(),
        year_course: number(),
        description: string(),
        thumbnail_link: string(),
        thumbnail_id: string(),
        category_course_id: number(),
        status: string().oneOf(['public', 'private'], 'Status of class must be private, public')
    })
})
module.exports = {createCourseSchema, updateCourseSchema}