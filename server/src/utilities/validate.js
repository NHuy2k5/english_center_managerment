const { object, string, number } = require("yup");

const infoObject = {
    phone: string().required().matches(/0\d{9}$/).test('check-unique', 'Phone is already in use', async (value) => {
        const user = await getUser(value, 'phone');
        return !user;
    }),
    email: string().notRequired().email().test('check-unique', 'Email is already in use', async (value) => {
        const user = await getUser(value, 'email');
        return !user;
    }),
    full_name: string().required(),
    address: string().required(),
}
const userObject = {
    user_name: string().required().test('check-unique', 'Username is already in use', async (value) => {
        // Nếu tồn tại user thì validate không thành công
        const user = await getUser(value, 'user_name');
        return !user;
    }),
    birthday: string().required().matches(/^\d{4}-\d{2}-\d{2}$/, 'Birthday Date must be in YYYY-MM-DD format'),
    sex: string().required().oneOf(['male', 'female', 'undefined'], 'Sex must be male, female, or undifined.'),
    role: string().required().oneOf(['admin', 'student', 'teacher', 'parent', 'general'], 'Role must be admin, student, teacher, parent or general'),
    password: string().required().min(6)
};
const studentObject = {
    parent_id: number().notrequire()
}
const parentObject = {
    balance: number().required()
}
const teacherObject = {
    balance: number().required(),
    description: string().notRequired(),
    thumbnail_link: string().notRequired().url(),
    thumbnail_id: string().notRequired(),
    status: string().required().oneOf(['private', 'public'], "Teacher status must be private or public"),
}
const registrations = {
    category_course_id: number.required()
}
const CategoryCourseObject = {
    category_course_name: string().required().test()
}
