// seeders/20260623161626-add-student-parent.js
'use strict';

const { Student, Parent } = require("../../models/index");

module.exports = {
    async up() {
        const students = await Student.findAll({
            attributes: ['id'],
            order: [['id', 'ASC']]
        });

        const parents = await Parent.findAll({
            attributes: ['id'],
            order: [['id', 'ASC']]
        });

        if (!students.length || !parents.length) {
            throw new Error('No students or parents found. Run previous seeders first.');
        }

        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            // Phân công phụ huynh theo vòng tròn
            const parent = parents[i % parents.length];

            await Student.update(
                { parent_id: parent.id },
                { where: { id: student.id } }
            );
        }

        console.log(`Updated parent_id for ${students.length} students`);
    },

    async down() {
        await Student.update(
            { parent_id: null },
            { where: {} }
        );
    }
};