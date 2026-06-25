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
        allowNull: true,
        type: Sequelize.DATE
      },
      sex: {
        allowNull: true,
        type: Sequelize.STRING(10)
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING(100),
        unique: true
      }, 
      phone: {
        allowNull: false,
        type: Sequelize.STRING(20),
        unique: true
      }, 
      avatar_link: {
        allowNull: true,
        type: Sequelize.STRING
      }, 
      avatar_id: {
        allowNull: true,
        type: Sequelize.STRING
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
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
    });
    await queryInterface.addConstraint('users', {
      fields: ['sex'],
      type: 'check',
      name: 'chk_user_sex',
      where: {
        sex: ['male', 'female', 'undefined']
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('users','chk_user_sex');
    await queryInterface.dropTable('users');
  }
};