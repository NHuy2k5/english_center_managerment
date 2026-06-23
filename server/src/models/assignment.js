'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Assignment.belongsTo(models.Teacher, {
        foreignKey: 'teacher_id'
      });
      Assignment.belongsTo(models.Lesson, {
        foreignKey: 'lesson_id'
      });
    }
  }
  Assignment.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    lesson_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'lessons',
        key: 'id'
      }
    },
    teacher_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'teachers',
        key: 'id'
      }
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING(30),
      defaultValue: 'main_teach'
    },
    pay_per_lesson: {
      allowNull: false,
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'Assignment',
    tableName: 'assignments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true
  });
  return Assignment;
};