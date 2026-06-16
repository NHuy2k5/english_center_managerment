'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('roles', {
      fields: ['name'],
      type: 'check',
      name: 'chk_role_name',
      where: {
        name: ['admin', 'student', 'teacher', 'parent', 'general']
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('roles','chk_role_name');
  }
};