const { object, string, number } = require("yup");
const { CategoryCourse } = require("../models/index");
const createCategoryCourseSchema = object({
    body: object({
        full_name: string().required(),
        phone: string().required().matches(/0\d{9}$/, "Invalid phone number"),
        email: string().notRequired().email("Email field must be Email format"),
        address: string().required(),
        category_course_id: number("Category course id must be a number").test('check-category-course-id-exists', "Category course id doesn't exist", async (value) => {
            const categoryCourse = await CategoryCourse.findByPk(value);
            return categoryCourse;
        })
    })
});
module.exports = createCategoryCourseSchema