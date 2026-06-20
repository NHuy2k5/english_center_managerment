'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lessons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      start: {
        allowNull: false,
        type: Sequelize.DATE
      },
      end: {
        allowNull: false,
        type: Sequelize.DATE
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING
      },
      listed_price: {
        allowNull: false,
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      class_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'classes',
          key: 'id'
        }
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING(100)
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
    await queryInterface.dropTable('lessons');
  }
};