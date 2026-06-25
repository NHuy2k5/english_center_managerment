const { ref, object, string, number, date } = require("yup");
const { Lesson } = require("../models/index");
const createLessonSchema = object({
    body: object({
        name: string().required(),
        start: date().required(),
        end: date().required().min(ref('start'), 'End date must be after start date'),
        description: string().notRequired(),
        listed_price: number().required().test('check-value-price', 'Total price must be greater or equal 0', (value) => value >= 0),
        address: string().required(),
        class_id: number().notRequired(),
        status: string().required().oneOf(['not_canceled', 'canceled'], 'Status of class must be not_canceled, canceled')
    })
});
const updateLessonSchema = object({
    body: object({
        name: string(),
        start: date(),
        end: date(),
        description: string(),
        listed_price: number().test('check-value-price', 'Total price must be greater or equal 0', (value) => value >= 0),
        address: string(),
        class_id: number(),
        status: string().oneOf(['not_canceled', 'canceled'], 'Status of class must be not_canceled, canceled')
    })
})
module.exports = {createLessonSchema, updateLessonSchema}