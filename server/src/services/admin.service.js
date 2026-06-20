const { getUser,
    createGeneralUser,
    createStudent,
    createTeacher
 } = require("./user.service");
const { successResponse, errrorResponse } = require("../utilities/response");
const { object, array, string, number, date } = require('yup');

module.exports = {
    show: async (req, res) => {
        const users = await getUsers();
        return res.json(users);
    },
    addGeneralUser: async (req, res) => {
        try {
            // Validate general user info
            
            const body = await schema.validate(req.body, {
                abortEarly: false
            });
            const user = await createGeneralUser(body);

        } catch (error) {
            let errors = null;
            let status = error.status;
            let message = "Falied to create user";
            console.log(error);
            // Nếu validate không thành công
            if (error.inner) {
                errors = Object.fromEntries(error.inner.map((err) => [err.path, err.message]));
                status = 400;
                message = "Validation falied";
            };
            // return errrorResponse({
            //     res,
            //     messgae,
            //     error: errors ? errors : error.message,
            //     status: status | 500
            // })
            res.status(status).json({ errors });
        }
    },
    addStudent: async (req, res) => {
        try {
            // Validate general user info
            let schema = object({
                username: string().required().test('check-unique', 'Username is already in use', async (value) => {
                    // Nếu tồn tại user thì validate không thành công
                    const username = await getUser(value, 'user_name');
                    return !username;
                }),
                phone: string().required().matches(/0\d{9}$/).test('check-unique', 'Phone is already in use', async (value) => {
                    const phone = await getUser(value, 'phone');
                    return !phone;
                }),
                email: string().notRequired().email().test('check-unique', 'Email is already in use',async (value) => {
                const email = await getUser(value, 'email');
                return !email;
                }),
                fullname: string().required().ensure(),
                birthday: string().required().matches(/^\d{4}-\d{2}-\d{2}$/, 'Birthday Date must be in YYYY-MM-DD format'),
                address: string().required(),
                sex: string().required().oneOf(['male', 'female', 'undefined'], 'Sex must be male, female, or undifined.'),
                roles: array().of(string().required().oneOf(['admin', 'student', 'teacher', 'parent', 'general'], 'Role must be admin, student, teacher, parent or general')),
                password: string().required().min(6)
            });
            const body = await schema.validate(req.body, {
                abortEarly: false
            });
            const user = await createStudent(body);

        } catch (error) {
            let errors = null;
            let status = error.status;
            let message = "Falied to create user";
            console.log(error);
            // Nếu validate không thành công
            if (error.inner) {
                errors = Object.fromEntries(error.inner.map((err) => [err.path, err.message]));
                status = 400;
                message = "Validation falied";
            };
            // return errrorResponse({
            //     res,
            //     messgae,
            //     error: errors ? errors : error.message,
            //     status: status | 500
            // })
            res.status(status).json({ errors });
        }
    },
    addTeacher: async (req, res) => {
        // const body = {
        //     username: '',
        //     phone: '',
        //     email: '',
        //     fullname: '',
        //     birthday: '',
        //     address: '',
        //     sex: '',
        //     roles: [],
        //     password,
        //     decription
        //     status
        // }
        try {
            // Validate general user info
            let schema = object({
                username: string().required().test('check-unique', 'Username is already in use', async (value) => {
                    // Nếu tồn tại user thì validate không thành công
                    const username = await getUser(value, 'user_name');
                    return !username;
                }),
                phone: string().required().matches(/0\d{9}$/).test('check-unique', 'Phone is already in use', async (value) => {
                    const phone = await getUser(value, 'phone');
                    return !phone;
                }),
                email: string().notRequired().email().test('check-unique', 'Email is already in use',async (value) => {
                const email = await getUser(value, 'email');
                return !email;
                }),
                fullname: string().required().ensure(),
                birthday: string().required().matches(/^\d{4}-\d{2}-\d{2}$/, 'Birthday Date must be in YYYY-MM-DD format'),
                address: string().required(),
                sex: string().required().oneOf(['male', 'female', 'undefined'], 'Sex must be male, female, or undifined.'),
                roles: array().of(string().required().oneOf(['admin', 'student', 'teacher', 'parent', 'general'], 'Role must be admin, student, teacher, parent or general')),
                password: string().required().min(6),
                description: string().notRequired(),
                status: string().required().oneOf(['private','public'],'Teacher status must be private or public')
            });
            const body = await schema.validate(req.body, {
                abortEarly: false
            });
            const user = await createStudent(body);

        } catch (error) {
            let errors = null;
            let status = error.status;
            let message = "Falied to create user";
            console.log(error);
            // Nếu validate không thành công
            if (error.inner) {
                errors = Object.fromEntries(error.inner.map((err) => [err.path, err.message]));
                status = 400;
                message = "Validation falied";
            };
            // return errrorResponse({
            //     res,
            //     messgae,
            //     error: errors ? errors : error.message,
            //     status: status | 500
            // })
            res.status(status).json({ errors });
        }
    }
}