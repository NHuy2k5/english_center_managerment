'use strict';

const {
    User,
    Student,
    UserRole,
    Role
} = require("../../models/index");
const { hashPassword } = require('../../utilities/hashing');

module.exports = {
    async up() {

        const now = new Date();

        const studentRole = await Role.findOne({
            where: {
                name: 'student'
            }
        });
        console.log('studentRole:', studentRole?.id, studentRole?.name);
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
            let user;
            try {
                user = await User.create({
                    ...data,
                    password,
                    birthday: new Date('2015-01-01'),
                    address: 'Hà Nội',
                    created_at: now,
                    updated_at: now
                });
                console.log('user created:', user?.id, user?.user_name, user?.deleted_at);
            } catch (err) {
                // Nếu đã tồn tại thì lấy ra dùng tiếp
                console.log('create error:', err.name, err.message);
                if (err.name === 'SequelizeUniqueConstraintError') {
                    user = await User.findOne({
                        where: { user_name: data.user_name },
                        paranoid: false
                    },);
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
                await Student.create({
                    id: user.id,
                    parent_id: null,
                    created_at: now,
                    updated_at: now
                });
            } catch (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    const student = await Student.findOne({
                        where: { id: user.id },
                        paranoid: false
                    });
                    if (student?.deleted_at) await student.restore(); // ✅
                } else {
                    throw err;
                }
            }

            try {
                await UserRole.create({
                    user_id: user.id,
                    role_id: studentRole.id,
                    created_at: now,
                    updated_at: now
                });
            } catch (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    const ur = await UserRole.findOne({
                        where: { user_id: user.id, role_id: studentRole.id },
                        paranoid: false
                    });
                    if (ur?.deleted_at) await ur.restore(); // ✅
                } else {
                    throw err;
                }
            }
        }
    },

    async down() {
        const { Session } = require("../../models/index"); // ✅ thêm import
        const { Op } = require('sequelize');
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
        await Session.destroy({
            where: { user_id: { [Op.in]: ids } },
            force: true
        });

        await UserRole.destroy({
            where: {
                user_id: ids
            },
            force: true
        });

        await Student.destroy({
            where: {
                id: ids
            },
            force: true
        });

        await User.destroy({
            where: {
                id: ids
            },
            force: true
        });
    }
};