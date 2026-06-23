const { ref, object, string, number, date } = require("yup");
const { Coupon } = require("../models/index");
const createCouponSchema = object({
    body: object({
        name: string().required(),
        discount: number().required().test('check-valid-discount-value', 'Discount value is invalid', (value) => value >= 0 && value <= 100),
        start: date().notRequired(),
        end: date().notRequired().min(ref(start), 'End date must be after start date'),
        description: string().notRequired(),
        number_of_users: number().required().test('check-valid-num-of-users', 'Number of users is invalid', (value) => value >= 0)
    })
});
const updateCouponSchema = object({
    body: object({
        name: string(),
        discount: number().test('check-valid-discount-value', 'Discount value is invalid', (value) =>value === undefined || (value >= 0 && value <= 100)),
        start: date(),
        end: date(),
        description: string(),
        number_of_users: number().test('check-valid-num-of-users', 'Number of users is invalid', (value) => value >= 0).test('after-number-of-student','new value must be greater or eqeal than current value ', async function(value) {
            const { couponID } = this.options.context;
            const coupon = await Coupon.findByPk(Number(couponID));
            let startDate;
            if (!coupon) {
                return false;
            }
            return value === undefined || value >= coupon.number_of_users
        })
    })
})
module.exports = {createCouponSchema, updateCouponSchema}