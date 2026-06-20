'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('classes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      total_students: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      course_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'courses',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'opened'
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
    await queryInterface.addConstraint('classes', {
        fields: ['status'],
        type: 'check',
        name: 'chk_class_status',
        where: {
          status: ['opened', 'closed']
        }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('classes', 'chk_class_status', {transaction: t});
    await queryInterface.dropTable('classes');
  }
};