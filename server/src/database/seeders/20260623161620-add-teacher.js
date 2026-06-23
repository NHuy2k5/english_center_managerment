'use strict';

const { hashPassword } = require('../../utilities/hashing');
const {
    User,
    Teacher,
    Role,
    UserRole
} = require('../models');

module.exports = {
    async up() {

        const now = new Date();

        const teacherRole = await Role.findOne({
            where: {
                name: 'teacher'
            }
        });

        const password = hashPassword('123456');

        const teachersData = [
            {
                user_name: 'teacher01',
                full_name: 'Nguyễn Thị Thu',
                email: 'teacher01@gmail.com',
                phone: '0920000001',
                sex: 'female',
                description: [
                    'Cử nhân Ngôn ngữ Anh - Đại học Hà Nội',
                    '5 năm kinh nghiệm giảng dạy tiếng Anh tiểu học',
                    'IELTS 7.5'
                ]
            },
            {
                user_name: 'teacher02',
                full_name: 'Trần Minh Quân',
                email: 'teacher02@gmail.com',
                phone: '0920000002',
                sex: 'male',
                description: [
                    'Thạc sĩ Ngôn ngữ Anh',
                    'Chuyên luyện thi THCS',
                    'IELTS 8.0'
                ]
            },
            {
                user_name: 'teacher03',
                full_name: 'Lê Ngọc Anh',
                email: 'teacher03@gmail.com',
                phone: '0920000003',
                sex: 'female',
                description: [
                    'Cử nhân Sư phạm Anh',
                    '7 năm kinh nghiệm giảng dạy',
                    'TESOL'
                ]
            },
            {
                user_name: 'teacher04',
                full_name: 'Phạm Văn Đức',
                email: 'teacher04@gmail.com',
                phone: '0920000004',
                sex: 'male',
                description: [
                    'Giảng viên tiếng Anh',
                    'Chuyên luyện thi IELTS',
                    'IELTS 8.5'
                ]
            },
            {
                user_name: 'teacher05',
                full_name: 'Hoàng Thị Mai',
                email: 'teacher05@gmail.com',
                phone: '0920000005',
                sex: 'female',
                description: [
                    'Cử nhân Ngôn ngữ Anh',
                    'Chuyên tiếng Anh thiếu nhi',
                    'Cambridge TKT'
                ]
            }
        ];

        for (const data of teachersData) {

            const user = await User.create({
                user_name: data.user_name,
                password,
                full_name: data.full_name,
                birthday: new Date('1990-01-01'),
                sex: data.sex,
                email: data.email,
                phone: data.phone,
                address: 'Hà Nội',
                created_at: now,
                updated_at: now
            });

            await Teacher.create({
                id: user.id,
                balance: 0,
                thumbnail_link: null,
                thumbnail_id: null,
                description: JSON.stringify(
                    data.description
                ),
                status: 'public',
                created_at: now,
                updated_at: now
            });

            await UserRole.create({
                user_id: user.id,
                role_id: teacherRole.id,
                created_at: now,
                updated_at: now
            });
        }
    },

    async down() {

        const usernames = [
            'teacher01',
            'teacher02',
            'teacher03',
            'teacher04',
            'teacher05'
        ];

        const users = await User.findAll({
            where: {
                user_name: usernames
            }
        });

        const ids = users.map(
            user => user.id
        );

        await UserRole.destroy({
            where: {
                user_id: ids
            }
        });

        await Teacher.destroy({
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