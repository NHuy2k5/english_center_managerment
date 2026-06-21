const { object, string, number } = require("yup");
const { User } = require("../models/index");
const createStudentSchema = object({
    body: object({
        user_name: string().required().test('check-unique', 'Username is already in use', async (value) => {
            // Nếu tồn tại user thì validate không thành công
            const user = await User.findOne({
                where: {
                    user_name: value
                }
            });
            return !user;
        }),
        phone: string().required().matches(/0\d{9}$/, "Invalid phone number").test('check-unique', 'Phone is already in use', async (value) => {
            const user = await User.findOne({
                where: {
                    phone: value
                }
            });
            return !user;
        }),
        email: string().notRequired().email("Email field must be Email format").test('check-unique', 'Email is already in use', async (value) => {
            const user = await User.findOne({
                where: {
                    email: value
                }
            });
            return !user;
        }),
        full_name: string().required(),
        address: string().required(),
        birthday: string().required().matches(/^\d{4}-\d{2}-\d{2}$/, 'Birthday Date must be in YYYY-MM-DD format'),
        sex: string().required().oneOf(['male', 'female', 'undefined'], 'Sex must be male, female, or undifined.'),
        password: string().required().min(6, "The password must be 6 characters or more."),
        parent_id: number().notRequired().nullable(),
        avatar_link: string().notRequired().url("Avatar link must be link url").nullable(),
        avatar_id: string().notRequired().nullable(),
    })
});

const updateStudentSchema = object({
    body: object({
        user_name: string().test('check-unique', 'Username is already in use', async function (value) {
            // Nếu tồn tại user thì validate không thành công
            if (value === undefined) {
                return true;
            }
            const { studentID } = this.options.context;
            const user = await User.findOne({
                where: {
                    user_name: value
                }
            });
            if (!user) {
                return true;
            };
            return user.id ===
                Number(studentID);
        }),
        phone: string().matches(/0\d{9}$/, "Invalid phone number").test('check-unique', 'Phone is already in use', async function (value) {
            if (value === undefined) {
                return true;
            }
            const { studentID } = this.options.context;
            const user = await User.findOne({
                where: {
                    phone: value
                }
            });
            if (!user) {
                return true;
            };
            return user.id ===
                Number(studentID);
        }),
        email: string().email("Email field must be Email format").test('check-unique', 'Email is already in use', async function (value) {
            if (value === undefined) {
                return true;
            }
            const { studentID } = this.options.context;
            const user = await User.findOne({
                where: {
                    email: value
                }
            });
            if (!user) {
                return true;
            };
            return user.id ===
                Number(studentID);
        }),
        full_name: string(),
        address: string(),
        birthday: string().required().matches(/^\d{4}-\d{2}-\d{2}$/, 'Birthday Date must be in YYYY-MM-DD format'),
        sex: string().oneOf(['male', 'female', 'undefined'], 'Sex must be male, female, or undifined.'),
        // password: string().min(6, "The password must be 6 characters or more."),
        parent_id: number().nullable(),
        avatar_link: string().url("Avatar link must be link url").nullable(),
        avatar_id: string().nullable(),
    })
})
