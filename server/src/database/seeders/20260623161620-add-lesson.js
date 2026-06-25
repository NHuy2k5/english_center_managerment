'use strict';

const { Class, Lesson } = require("../../models/index");

module.exports = {
    async up() {

        const classes = await Class.findAll();

        const lessons = [];

        const now = new Date();

        for (const cls of classes) {

            const grade = parseInt(
                cls.name.match(/\d+/)?.[0]
            );

            let listedPrice = 100000;

            if (grade >= 6 && grade <= 9) {
                listedPrice = 120000;
            }

            if (grade >= 10) {
                listedPrice = 150000;
            }

            for (let i = 1; i <= 10; i++) {

                const start = new Date(now);

                start.setDate(
                    start.getDate() + (i - 1) * 3
                );

                start.setHours(18, 0, 0, 0);

                const end = new Date(start);

                end.setMinutes(
                    end.getMinutes() + 90
                );

                lessons.push({
                    name: `Buổi ${i}`,
                    start,
                    end,
                    description: `Nội dung bài học số ${i}`,
                    listed_price: listedPrice,
                    class_id: cls.id,
                    address: 'Trung tâm Anh ngữ ABC',
                    status: 'not_canceled',
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
        }

        await Lesson.bulkCreate(
            lessons
        );
    },

    async down() {

        const classes = await Class.findAll({ attributes: ['id'] });
        const classIds = classes.map(c => c.id);
        const { Op } = require('sequelize');
        await Lesson.destroy({
            where: { class_id: { [Op.in]: classIds } }
        });

    }
};