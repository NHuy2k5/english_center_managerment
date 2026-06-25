// add-parent.js
'use strict';

const { User, Parent, Role, UserRole } = require("../../models/index");
const { hashPassword } = require('../../utilities/hashing');

module.exports = {
    async up() {
        const now = new Date();

        const parentRole = await Role.findOne({
            where: { name: 'parent' }
        });

        const password = await hashPassword('123456');

        const parentsData = [
            {
                user_name: 'parent01',
                full_name: 'Nguyễn Văn Minh',
                email: 'parent01@gmail.com',
                phone: '0910000001',
                sex: 'male',
                balance: 5000000
            },
            {
                user_name: 'parent02',
                full_name: 'Trần Thị Lan',
                email: 'parent02@gmail.com',
                phone: '0910000002',
                sex: 'female',
                balance: 3000000
            },
            {
                user_name: 'parent03',
                full_name: 'Lê Văn Hùng',
                email: 'parent03@gmail.com',
                phone: '0910000003',
                sex: 'male',
                balance: 7000000
            },
            {
                user_name: 'parent04',
                full_name: 'Phạm Thị Mai',
                email: 'parent04@gmail.com',
                phone: '0910000004',
                sex: 'female',
                balance: 2500000
            },
            {
                user_name: 'parent05',
                full_name: 'Hoàng Văn Đức',
                email: 'parent05@gmail.com',
                phone: '0910000005',
                sex: 'male',
                balance: 10000000
            }
        ];

        for (const data of parentsData) {
            let user;
            try {
                user = await User.create({
                    user_name: data.user_name,
                    password,
                    full_name: data.full_name,
                    birthday: new Date('1985-01-01'),
                    sex: data.sex,
                    email: data.email,
                    phone: data.phone,
                    address: 'Hà Nội',
                    created_at: now,
                    updated_at: now
                });
            } catch (err) {
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
                await Parent.create({
                    id: user.id,
                    balance: data.balance,
                    created_at: now,
                    updated_at: now
                });
            } catch (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    const parent = await Parent.findOne({
                        where: { id: user.id },
                        paranoid: false
                    });
                    if (parent?.deleted_at) await parent.restore(); // ✅
                } else {
                    throw err;
                }
            }
            try {
                await UserRole.create({
                    user_id: user.id,
                    role_id: parentRole.id,
                    created_at: now,
                    updated_at: now
                });
            } catch (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    const ur = await UserRole.findOne({
                        where: { user_id: user.id, role_id: parentRole.id },
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
        const usernames = ['parent01', 'parent02', 'parent03', 'parent04', 'parent05'];
        const users = await User.findAll({ where: { user_name: usernames } });
        const ids = users.map(u => u.id);
        await Session.destroy({
            where: { user_id: { [Op.in]: ids } },
            force: true
        });

        await UserRole.destroy({ where: { user_id: ids }, force: true });
        await Parent.destroy({ where: { id: ids }, force: true });
        await User.destroy({ where: { id: ids }, force: true });
    }
};