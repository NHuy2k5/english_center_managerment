'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addConstraint('roles', {
      fields: ['name'],
      type: 'check',
      name: 'chk_role_name',
      where: {
        name: ['admin', 'student', 'teacher', 'parent']
      }
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('roles','chk_role_name');
    await queryInterface.dropTable('roles');
  }
};