'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assignments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lesson_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'lessons',
          key: 'id'
        }
      },
      teacher_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'teachers',
          key: 'id'
        }
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING(30),
        defaultValue: 'main_teach'
      },
      pay_per_lesson: {
        allowNull: false,
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
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
    await queryInterface.addConstraint('assignments', {
      fields: ['status'],
      type: 'check',
      name: 'chk_assignment_status',
      where: {
        status: ['teaching']
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('assignments','chk_assignment_status');
    await queryInterface.dropTable('assignments');
  }
};