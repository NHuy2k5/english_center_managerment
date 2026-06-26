const { ref, object, string, number, date } = require("yup");
const { Class } = require("../models/index");
const createClassSchema = object({
    body: object({
        course_id: number().notRequired(),
        total_students: number().required().test('check-value-total-students', 'Total students must be greater or equal 0', (value) => value >= 0),
        name: string().required(),
        status: string().required().oneOf(['public', 'private'], 'Status of class must be private, public')
    })
});
const updateClassSchema = object({
    body: object({
        course_id: number(),
        total_students: number().test('check-value-total-students', 'Total students must be greater or equal 0', (value) => value === undefined || value >= 0),
        name: string(),
        status: string().oneOf(['public', 'private'], 'Status of class must be private, public')
    })
})
module.exports = {createClassSchema, updateClassSchema}