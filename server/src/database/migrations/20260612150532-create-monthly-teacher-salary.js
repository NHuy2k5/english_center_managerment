'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('monthly_teacher_salaries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      teacher_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'teachers',
          key: 'id'
        }
      },
      the_first_of_the_month: {
        allowNull: false,
        type: Sequelize.DATEONLY
      }, 
      the_end_of_the_month: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      total_lessons_teached: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      monthly_salary: {
        allowNull: false,
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      is_teacher_paid: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('monthly_teacher_salaries');
  }
};