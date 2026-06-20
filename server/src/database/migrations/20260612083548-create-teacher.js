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
    await queryInterface.addConstraint('teachers', {
        fields: ['status'],
        type: 'check',
        name: 'chk_teacher_status',
        where: {
          status: ['private', 'public']
        }
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('teachers', 'chk_teacher_status');
    await queryInterface.dropTable('teachers');
  }
};