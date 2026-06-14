'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentLesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudentLesson.init({
    student_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    lesson_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING(30),
      defaultValue: 'ready'
    }
  }, {
    sequelize,
    modelName: 'StudentLesson',
    tableName: 'student_lesson',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return StudentLesson;
};