'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TuitionFee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TuitionFee.belongsTo(models.Student, {
        foreignKey: 'student_id'
      });
      TuitionFee.belongsTo(models.Class, {
        foreignKey: 'class_id'
      });
      TuitionFee.belongsTo(models.Coupon, {
        foreignKey: 'coupon_id'
      });
    }
  }
  TuitionFee.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    student_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    class_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    the_first_of_the_month: {
      allowNull: false,
      type: DataTypes.DATEONLY
    },
    the_end_of_the_month: {
      allowNull: false,
      type: DataTypes.DATEONLY
    },
    total_reality_lessons: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    actual_listed_tuition_fee: {
      allowNull: false,
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    coupon_id: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    have_student_paid: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'TuitionFee',
    tableName: 'tuition_fees',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return TuitionFee;
};