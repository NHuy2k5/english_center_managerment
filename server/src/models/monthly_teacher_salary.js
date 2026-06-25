'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MonthlyTeacherSalary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MonthlyTeacherSalary.belongsTo(models.Teacher, {
        foreignKey: 'teacher_id'
      })
    }
  }
  MonthlyTeacherSalary.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    teacher_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    the_first_of_the_month: {
      allowNull: false,
      type: DataTypes.DATEONLY
    },
    the_end_of_the_month: {
      allowNull: false,
      type: DataTypes.DATEONLY
    },
    total_lessons_teached: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    monthly_salary: {
      allowNull: false,
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    is_teacher_paid: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'MonthlyTeacherSalary',
    tableName: 'monthly_teacher_salaries',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return MonthlyTeacherSalary;
};