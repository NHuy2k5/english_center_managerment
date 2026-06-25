// add-teacher.js
'use strict';

const { hashPassword } = require('../../utilities/hashing');
const { User, Teacher, Role, UserRole } = require("../../models/index");

module.exports = {
    async up() {
        const now = new Date();

        const teacherRole = await Role.findOne({
            where: { name: 'teacher' }
        });

        const password = await hashPassword('123456');

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
            let user;
            try {
                user = await User.create({
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
            } catch (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    user = await User.findOne({ where: { user_name: data.user_name }, paranoid: false });
                    if (user && user.deleted_at) {
                        await user.restore();
                        // Update password phòng trường hợp đã đổi
                        await user.update({
                            password,
                            updated_at: now
                        });
                    }
                    console.log('user found after error:', user?.id, user?.deleted_at);
                } else {
                    throw err;
                }
            }

            if (!user) continue;

            try {
                await Teacher.create({
                    id: user.id,
                    balance: 0,
                    thumbnail_link: null,
                    thumbnail_id: null,
                    description: data.description,
                    status: 'public',
                    created_at: now,
                    updated_at: now
                });
            } catch (err) {
                // Nếu đã tồn tại thì lấy ra dùng tiếp
                if (err.name === 'SequelizeUniqueConstraintError') {
                    const teacher = await Teacher.findOne({
                        where: { id: user.id },
                        paranoid: false
                    });
                    if (teacher?.deleted_at) await teacher.restore(); // ✅
                } else {
                    throw err;
                }
            }
            try {
                await UserRole.create({
                    user_id: user.id,
                    role_id: teacherRole.id,
                    created_at: now,
                    updated_at: now
                });
            } catch (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    const ur = await UserRole.findOne({
                        where: { user_id: user.id, role_id: teacherRole.id },
                        paranoid: false
                    });
                    if (ur?.deleted_at) await ur.restore(); // ✅
                }
            }
        }
    },

    async down() {
        const { Session } = require("../../models/index"); // ✅ thêm import
        const { Op } = require('sequelize');
        const usernames = ['teacher01', 'teacher02', 'teacher03', 'teacher04', 'teacher05'];
        const users = await User.findAll({ where: { user_name: usernames } });
        const ids = users.map(u => u.id);
        await Session.destroy({
            where: { user_id: { [Op.in]: ids } },
            force: true
        });
        await UserRole.destroy({ where: { user_id: ids }, force: true });
        await Teacher.destroy({ where: { id: ids }, force: true });
        await User.destroy({ where: { id: ids }, force: true });
    }
};