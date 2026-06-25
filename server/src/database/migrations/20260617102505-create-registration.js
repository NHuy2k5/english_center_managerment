'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('registrations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      full_name: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      category_course_id: {                
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
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
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('registrations');
  }
};