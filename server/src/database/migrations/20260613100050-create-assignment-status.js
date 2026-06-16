'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('assignments', {
      fields: ['status'],
      type: 'check',
      name: 'chk_assignment_status',
      where: {
        status: ['main_teach','substitute_teach', 'absence_from_teaching']
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('assignments','chk_assignment_status');
  }
};