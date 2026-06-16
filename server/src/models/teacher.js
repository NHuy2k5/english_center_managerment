'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Teacher.belongsTo(models.User, {
        foreignKey: 'id'
      });
      Teacher.belongsToMany(models.Class, {
        through: 'teacher_class',
        foreignKey: 'teacher_id'
      });
      Teacher.hasMany(models.Assignment, {
        foreignKey: 'teacher_id'
      });
      Teacher.hasMany(models.MonthlyTeacherSalary, {
        foreignKey: 'teacher_id'
      })
    }
  }
  Teacher.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    balance: {
      allowNull: false,
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    thumbnail_link: {
      allowNULL: true,
      type: DataTypes.STRING
    },
    thumbnail_id: {
      allowNULL: true,
      type: DataTypes.STRING
    },
    description: {
      allowNULL: true,
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'private'
    }
  }, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'teachers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Teacher;
};