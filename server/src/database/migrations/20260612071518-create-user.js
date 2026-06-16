'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_name: {
        allowNull: false,
        type: Sequelize.STRING(50),
        unique: true
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      full_name: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      birthday: {
        allowNULL: true,
        type: Sequelize.DATE
      },
      sex: {
        allowNULL: true,
        type: Sequelize.STRING(10)
      },
      email: {
        allowNULL: true,
        type: Sequelize.STRING(100),
        unique: true
      }, 
      phone: {
        allowNULL: false,
        type: Sequelize.STRING(20),
        unique: true
      }, 
      avatar_link: {
        allowNULL: true,
        type: Sequelize.STRING
      }, 
      avatar_id: {
        allowNULL: true,
        type: Sequelize.STRING
      },
      address_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'addresses',
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
    await queryInterface.dropTable('users');
  }
};