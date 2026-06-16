'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      year_course: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: new Date().getFullYear()
      },
      total_students_registered: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_students_dropped_out: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_lessons: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      listed_price: {
        allowNull: false,
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      thumbnail_link: {
        allowNULL: true,
        type: Sequelize.STRING
      },
      thumbnail_id: {
        allowNULL: true,
        type: Sequelize.STRING
      },
      category_course_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        reference: {
          model: 'category_courses',
          key: 'id'
        }
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
    await queryInterface.dropTable('courses');
  }
};