'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      // Thêm cột status vào table courses
      await queryInterface.addColumn('courses', 'status', {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'private'
      }, {transaction: t});
      await queryInterface.addColumn('teachers', 'status', {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'private'
      }, {transaction: t});
      await queryInterface.addConstraint('courses', {
        fields: ['status'],
        type: 'check',
        name: 'chk_course_status',
        where: {
          status: ['private', 'public', 'closed']
        }
      }, {transaction: t});
      await queryInterface.addConstraint('teachers', {
        fields: ['status'],
        type: 'check',
        name: 'chk_teacher_status',
        where: {
          status: ['private', 'public']
        }
      }, {transaction: t});
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeConstraint('courses', 'chk_course_status', {transaction: t});
      await queryInterface.removeConstraint('teachers', 'chk_teacher_status', {transaction: t});
      await queryInterface.removeColumn('courses', 'status', {transaction: t});
      await queryInterface.removeColumn('teachers', 'status', {transaction: t});
    });
  }
};
