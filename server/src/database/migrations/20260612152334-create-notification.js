'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING(30),
        defaultValue: 'general'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      read_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addConstraint('notifications', {
      fields: ['type'],
      type: 'check',
      name: 'chk_notification_type',
      where: {
        type: ['general', 'lesson', 'tuition_fee', 'monthly_salary']
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('notifications','chk_notification_type');
    await queryInterface.dropTable('notifications');
  }
};