'use strict';

const { Coupon } = require("../models/index");

module.exports = {
    async up() {

        const now = new Date();

        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const next3Months = new Date();
        next3Months.setMonth(next3Months.getMonth() + 3);

        const next6Months = new Date();
        next6Months.setMonth(next6Months.getMonth() + 6);
        
        const next9Months = new Date();
        next9Months.setMonth(next9Months.getMonth() + 9);
        await Coupon.bulkCreate([
            {
                name: 'WELCOME10',
                discount: 10,
                start: now,
                end: next6Months,
                description: 'Giảm 10% học phí cho học viên mới.',
                created_at: now,
                updated_at: now
            },
            {
                name: 'SUMMER15',
                discount: 15,
                start: now,
                end: nextMonth,
                description: 'Ưu đãi hè giảm 15% học phí.',
                created_at: now,
                updated_at: now
            },
            {
                name: 'BACK2SCHOOL20',
                discount: 20,
                start: now,
                end: next3Months,
                description: 'Giảm 20% cho học sinh đăng ký đầu năm học.',
                created_at: now,
                updated_at: now
            },
            {
                name: 'SIBLING10',
                discount: 10,
                start: now,
                end: null,
                description: 'Giảm 10% cho anh chị em học cùng trung tâm.',
                created_at: now,
                updated_at: now
            },
            {
                name: 'EARLYBIRD25',
                discount: 25,
                start: now,
                end: next9Month,
                description: 'Ưu đãi đăng ký sớm giảm 25%.',
                created_at: now,
                updated_at: now
            },
            {
                name: 'VIP30',
                discount: 30,
                start: now,
                end: next3Months,
                description: 'Ưu đãi đặc biệt cho học viên thân thiết.',
                created_at: now,
                updated_at: now
            }
        ]);
    },

    async down() {
        await Discount.destroy({
            where: {
                name: [
                    'WELCOME10',
                    'SUMMER15',
                    'BACK2SCHOOL20',
                    'SIBLING10',
                    'EARLYBIRD25',
                    'VIP30'
                ]
            }
        });
    }
};