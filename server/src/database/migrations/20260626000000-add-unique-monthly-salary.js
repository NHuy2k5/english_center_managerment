'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint('monthly_teacher_salaries', {
            fields: ['teacher_id', 'the_first_of_the_month'],
            type: 'unique',
            name: 'unique_teacher_month_salary'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint(
            'monthly_teacher_salaries',
            'unique_teacher_month_salary'
        );
    }
};