// add-admin.js
'use strict';

const { User, Admin, Role, UserRole } = require("../../models/index");
const { hashPassword } = require('../../utilities/hashing');

module.exports = {
    async up() {
        const now = new Date();

        const adminRole = await Role.findOne({
            where: { name: 'admin' }
        });

        const password = await hashPassword('123456');

        const adminsData = [
            {
                user_name: 'admin01',
                full_name: 'Nguyễn Quang Huy',
                email: 'admin01@gmail.com',
                phone: '0930000001',
                sex: 'male',
                config: { showTeacherInStudentSchedule: false }
            },
            {
                user_name: 'admin02',
                full_name: 'Trịnh Trung Kiên',
                email: 'admin02@gmail.com',
                phone: '0930000002',
                sex: 'male',
                config: { showTeacherInStudentSchedule: false }
            },
            {
                user_name: 'admin03',
                full_name: 'Trần Xuân Thủy',
                email: 'admin03@gmail.com',
                phone: '0930000003',
                sex: 'female',
                config: { showTeacherInStudentSchedule: false }
            }
        ];

        for (const data of adminsData) {
            let user;
            try {
                user = await User.create({
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
                } else {
                    throw err;
                }
            }

            if (!user) continue;

            try {
                await Admin.create({
                    id: user.id,
                    config: data.config,
                    created_at: now,
                    updated_at: now
                });
            } catch (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    const admin = await Admin.findOne({
                        where: { id: user.id },
                        paranoid: false
                    });
                    if (admin?.deleted_at) await admin.restore(); // ✅
                } else {
                    throw err;
                }
            }

            try {
                await UserRole.create({
                    user_id: user.id,
                    role_id: adminRole.id,
                    created_at: now,
                    updated_at: now
                });
            } catch (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    const ur = await UserRole.findOne({
                        where: { user_id: user.id, role_id: adminRole.id },
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
        const usernames = ['admin01', 'admin02', 'admin03'];
        const users = await User.findAll({ where: { user_name: usernames } });
        const ids = users.map(u => u.id);
        await Session.destroy({
            where: { user_id: { [Op.in]: ids } },
            force: true
        });
        await UserRole.destroy({ where: { user_id: ids }, force: true });
        await Admin.destroy({ where: { id: ids }, force: true });
        await User.destroy({ where: { id: ids }, force: true });
    }
};