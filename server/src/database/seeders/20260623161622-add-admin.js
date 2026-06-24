'use strict';

const {
    User,
    Admin,
    Role,
    UserRole
} = require('../models');
const { hashPassword } = require('../../utilities/hashing');

module.exports = {
    async up() {

        const now = new Date();

        const adminRole = await Role.findOne({
            where: {
                name: 'admin'
            }
        });

        const password = hashPassword('123456');

        const adminsData = [
            {
                user_name: 'admin01',
                full_name: 'Nguyễn Quang Huy',
                email: 'admin01@gmail.com',
                phone: '0930000001',
                sex: 'male',
                config: {
                    showTeacherInStudentSchedule: false,
                }
            },
            {
                user_name: 'admin02',
                full_name: 'Trịnh Trung Kiên',
                email: 'admin02@gmail.com',
                phone: '0930000002',
                sex: 'male',
                config: {
                    showTeacherInStudentSchedule: false,
                }
            },
            {
                user_name: 'admin03',
                full_name: 'Trần Xuân Thủy',
                email: 'admin03@gmail.com',
                phone: '0930000003',
                sex: 'female',
                config: {
                    showTeacherInStudentSchedule: false,
                }
            },
        ];

        for (const data of parentsData) {

            const user = await User.create({
                user_name: data.user_name,
                password,
                full_name: data.full_name,
                birthday: new Date('2005-01-01'),
                sex: data.sex,
                email: data.email,
                phone: data.phone,
                address: 'Hà Nội',
                created_at: now,
                updated_at: now
            });

            await Admin.create({
                id: user.id,
                config,
                created_at: now,
                updated_at: now
            });

            await UserRole.create({
                user_id: user.id,
                role_id: adminRole.id,
                created_at: now,
                updated_at: now
            });
        }
    },

    async down() {

        const usernames = [
            'admin01',
            'admin02',
            'admin03',
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