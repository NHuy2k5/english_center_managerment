// seeders/20260623161622-add-student-lesson.js
'use strict';

const { Student, Lesson, StudentClass, StudentLesson } = require("../../models/index");

module.exports = {
    async up() {
        const now = new Date();

        // Lấy các StudentClass để biết học sinh thuộc lớp nào
        const studentClasses = await StudentClass.findAll({
            attributes: ['student_id', 'class_id', 'left_at']
        });

        if (!studentClasses.length) {
            throw new Error('No student-class records found. Run previous seeders first.');
        }

        const lessons = await Lesson.findAll({
            attributes: ['id', 'class_id', 'start']
        });

        if (!lessons.length) {
            throw new Error('No lessons found. Run previous seeders first.');
        }

        // Map lesson theo class_id để tra cứu nhanh
        const lessonsByClass = {};
        for (const lesson of lessons) {
            if (!lessonsByClass[lesson.class_id]) {
                lessonsByClass[lesson.class_id] = [];
            }
            lessonsByClass[lesson.class_id].push(lesson);
        }

        const STATUSES = [
            'attended',
            'attended',
            'attended',         // attended nhiều hơn để thực tế hơn
            'excused-absence',
            'unexcused-absence'
        ];

        const studentLessons = [];
        let statusIndex = 0;

        for (const sc of studentClasses) {
            const classLessons = lessonsByClass[sc.class_id] || [];

            for (const lesson of classLessons) {
                // Nếu học sinh đã nghỉ trước buổi học thì status là ready
                const leftBeforeLesson =
                    sc.left_at && new Date(lesson.start) > new Date(sc.left_at);

                const status = leftBeforeLesson
                    ? 'ready'
                    : STATUSES[statusIndex % STATUSES.length];

                studentLessons.push({
                    student_id: sc.student_id,
                    lesson_id: lesson.id,
                    status,
                    created_at: now,
                    updated_at: now
                });

                statusIndex++;
            }
        }

        await StudentLesson.bulkCreate(studentLessons, {
            ignoreDuplicates: true
        });
    },

    async down() {
        const studentClasses = await StudentClass.findAll({
            attributes: ['student_id']
        });

        const studentIds = studentClasses.map(sc => sc.student_id);

        await StudentLesson.destroy({
            where: {
                student_id: studentIds
            }
        });
    }
};