'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CategoryCourse.hasMany(models.Registration, {
        foreignKey: 'category_course_id'
      });
      CategoryCourse.hasMany(models.Course, {
        foreignKey: 'category_course_id'
      });
      CategoryCourse.hasMany(models.GeneralUser, {
        foreignKey: 'category_course_id'
      });
    }
  }
  CategoryCourse.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
  }, {
    sequelize,
    modelName: 'CategoryCourse',
    tableName: 'category_courses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return CategoryCourse;
};