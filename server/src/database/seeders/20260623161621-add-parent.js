'use strict';

const {
    User,
    Parent,
    Role,
    UserRole
} = require('../models');
const { hashPassword } = require('../../utilities/hashing');

module.exports = {
    async up() {

        const now = new Date();

        const parentRole = await Role.findOne({
            where: {
                name: 'parent'
            }
        });

        const password = hashPassword('123456');

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

            const user = await User.create({
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

            await Parent.create({
                id: user.id,
                balance: data.balance,
                created_at: now,
                updated_at: now
            });

            await UserRole.create({
                user_id: user.id,
                role_id: parentRole.id,
                created_at: now,
                updated_at: now
            });
        }
    },

    async down() {

        const usernames = [
            'parent01',
            'parent02',
            'parent03',
            'parent04',
            'parent05'
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

        await Parent.destroy({
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