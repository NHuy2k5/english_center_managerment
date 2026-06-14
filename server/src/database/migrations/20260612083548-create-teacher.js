'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teachers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          id: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      balance: {
        allowNull: false,
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      thumbnail_link: {
        allowNULL: true,
        type: Sequelize.STRING
      },
      thumbnail_id: {
        allowNULL: true,
        type: Sequelize.STRING
      },
      description: {
        allowNULL: true,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('teachers');
  }
};