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
      discount: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'private'
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
    await queryInterface.addConstraint('courses', {
        fields: ['status'],
        type: 'check',
        name: 'chk_course_status',
        where: {
          status: ['private', 'public', 'closed']
        }
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('courses', 'chk_course_status');
    await queryInterface.dropTable('courses');
  }
};