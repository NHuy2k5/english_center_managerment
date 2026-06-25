'use strict';

const { Course, Class } = require("../../models/index");

module.exports = {
    async up() {

        const courses = await Course.findAll({
            attributes: ['id', 'name']
        });

        const classes = [];

        for (const course of courses) {

            const grade =
                course.name.match(/\d+/)?.[0];

            if (!grade) continue;

            ['A', 'B', 'C'].forEach(letter => {

                classes.push({
                    name: `${grade}${letter}`,
                    total_students: 50,
                    course_id: course.id,
                    status: 'opened',
                    created_at: new Date(),
                    updated_at: new Date()
                });

            });
        }

        await Class.bulkCreate(classes);
    },

    async down() {
        const { Op } = require('sequelize');
        const courses = await Course.findAll({ attributes: ['id'] });
        const courseIds = courses.map(c => c.id);
        await Class.destroy({
            where: { course_id: { [Op.in]: courseIds } }
        });
    }
};