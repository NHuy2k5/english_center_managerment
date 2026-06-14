'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('student_lesson', {
      fields: ['status'],
      type: 'check',
      name: 'chk_student_lesson_status',
      where: {
        status: ['ready', 'attended', 'excused-absence', 'unexcused-absence']
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('student_lesson','chk_student_lesson_status');
  }
};