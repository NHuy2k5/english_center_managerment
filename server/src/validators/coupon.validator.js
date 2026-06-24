const { ref, object, string, number, date } = require("yup");
const { Coupon } = require("../models/index");
const createCouponSchema = object({
    body: object({
        name: string().required(),
        discount: number().required().test('check-valid-discount-value', 'Discount value is invalid', (value) => value >= 0 && value <= 100),
        start: date().notRequired(),
        end: date().notRequired().min(ref(start), 'End date must be after start date'),
        description: string().notRequired()
    })
});
const updateCouponSchema = object({
    body: object({
        name: string(),
        discount: number().test('check-valid-discount-value', 'Discount value is invalid', (value) =>value === undefined || (value >= 0 && value <= 100)),
        start: date(),
        end: date(),
        description: string()
    })
})
module.exports = {createCouponSchema, updateCouponSchema}