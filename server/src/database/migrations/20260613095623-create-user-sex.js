'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('users', {
      fields: ['sex'],
      type: 'check',
      name: 'chk_user_sex',
      where: {
        sex: ['male', 'female', 'undefined']
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('users','chk_user_sex');
  }
};