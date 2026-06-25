// seeders/20260623161621-add-assignment.js
'use strict';

const { Assignment, Teacher, Lesson, User } = require("../../models/index");

module.exports = {
    async up() {
        const now = new Date();

        // Lấy tất cả teachers và lessons
        const teachers = await Teacher.findAll({ attributes: ['id'] });
        const lessons = await Lesson.findAll({ attributes: ['id', 'class_id'] });

        // if (!teachers.length || !lessons.length) {
        //     throw new Error('No teachers or lessons found. Run previous seeders first.');
        // }

        const assignments = [];

        lessons.forEach((lesson, index) => {
            // Phân công giáo viên theo vòng tròn
            const teacher = teachers[index % teachers.length];

            // Xen kẽ status để có dữ liệu đa dạng
            const status = 'teaching';

            assignments.push({
                lesson_id: lesson.id,
                teacher_id: teacher.id,
                status,
                pay_per_lesson: 100000,
                created_at: now,
                updated_at: now
            });
        });

        await Assignment.bulkCreate(assignments);
    },

    async down() {
        const lessons = await Lesson.findAll({ attributes: ['id'] });
        const lessonIds = lessons.map(l => l.id);

        await Assignment.destroy({
            where: {
                lesson_id: lessonIds
            }
        });
    }
};