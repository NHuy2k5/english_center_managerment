'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_lesson', {
      student_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'students',
          key: 'id'
        }
      },
      lesson_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'lessons',
          key: 'id'
        }
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING(30),
        defaultValue: 'ready'
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
    await queryInterface.dropTable('student_lesson');
  }
};