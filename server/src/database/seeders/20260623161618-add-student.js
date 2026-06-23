'use strict';

const {
    User,
    Student,
    UserRole,
    Role
} = require("../models/index");
const { hashPassword } = require('../../utilities/hashing');

module.exports = {
    async up() {

        const now = new Date();

        const studentRole = await Role.findOne({
            where: {
                name: 'student'
            }
        });

        const password = await hashPassword('123456');

        const studentsData = [
            {
                user_name: 'student01',
                full_name: 'Nguyễn Văn An',
                email: 'student01@gmail.com',
                phone: '0900000001',
                sex: 'male'
            },
            {
                user_name: 'student02',
                full_name: 'Trần Thị Bình',
                email: 'student02@gmail.com',
                phone: '0900000002',
                sex: 'female'
            },
            {
                user_name: 'student03',
                full_name: 'Lê Minh Châu',
                email: 'student03@gmail.com',
                phone: '0900000003',
                sex: 'male'
            },
            {
                user_name: 'student04',
                full_name: 'Phạm Ngọc Dung',
                email: 'student04@gmail.com',
                phone: '0900000004',
                sex: 'female'
            },
            {
                user_name: 'student05',
                full_name: 'Hoàng Gia Huy',
                email: 'student05@gmail.com',
                phone: '0900000005',
                sex: 'male'
            }
        ];

        for (const data of studentsData) {

            const user = await User.create({
                ...data,
                password,
                birthday: new Date('2015-01-01'),
                address: 'Hà Nội',
                created_at: now,
                updated_at: now
            });

            await Student.create({
                id: user.id,
                parent_id: null,
                created_at: now,
                updated_at: now
            });

            await UserRole.create({
                user_id: user.id,
                role_id: studentRole.id,
                created_at: now,
                updated_at: now
            });
        }
    },

    async down() {

        const usernames = [
            'student01',
            'student02',
            'student03',
            'student04',
            'student05'
        ];

        const users = await User.findAll({
            where: {
                user_name: usernames
            }
        });

        const ids = users.map(u => u.id);

        await UserRole.destroy({
            where: {
                user_id: ids
            }
        });

        await Student.destroy({
            where: {
                id: ids
            }
        });

        await User.destroy({
            where: {
                id: ids
            }
        });
    }
};