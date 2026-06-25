// seeders/20260623161621-add-student-class.js
'use strict';

const { Student, Class, StudentClass } = require("../../models/index");

module.exports = {
    async up() {
        const now = new Date();

        const students = await Student.findAll({ attributes: ['id'] });
        const classes = await Class.findAll({ attributes: ['id', 'total_students'] });

        if (!students.length || !classes.length) {
            throw new Error('No students or classes found. Run previous seeders first.');
        }

        const studentClasses = [];

        // Phân học sinh vào lớp theo vòng tròn
        // Đảm bảo không vượt quá total_students của lớp
        const classStudentCount = {};

        students.forEach((student, index) => {
            const cls = classes[index % classes.length];

            if (!classStudentCount[cls.id]) {
                classStudentCount[cls.id] = 0;
            }

            // Bỏ qua nếu lớp đã đủ học sinh
            if (classStudentCount[cls.id] >= cls.total_students) {
                return;
            }

            // 1 học sinh có left_at để test trường hợp nghỉ học
            const isDropped = index === 2;

            studentClasses.push({
                student_id: student.id,
                class_id: cls.id,
                enrolled_at: now,
                left_at: isDropped
                    ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // nghỉ sau 7 ngày
                    : null,
                created_at: now,
                updated_at: now
            });

            classStudentCount[cls.id]++;
        });

        await StudentClass.bulkCreate(studentClasses, {
            ignoreDuplicates: true
        });
    },

    async down() {
        const students = await Student.findAll({ attributes: ['id'] });
        const studentIds = students.map(s => s.id);

        await StudentClass.destroy({
            where: {
                student_id: studentIds
            }
        });
    }
};