'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tuition_fees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      student_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'students',
          key: 'id'
        }
      },
      class_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'classes',
          key: 'id'
        }
      },
      the_first_of_the_month: {
        allowNull: false,
        type: Sequelize.DATEONLY
      }, 
      the_end_of_the_month: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      total_reality_lessons: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      actual_listed_tuition_fee: {
        allowNull: false,
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      coupon_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'coupons',
          key: 'id'
        }
      },
      have_student_paid: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      uniqueKeys: {
        tuition_fees_unique: {
          fields: ['student_id', 'class_id', 'the_first_of_the_month']
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tuition_fees');
  }
};