'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.CategoryCourse, {
        foreignKey: 'category_course_id'
      });
      Course.hasMany(models.Class, {
        foreignKey: 'course_id'
      })
    }
  }
  Course.init({
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
    year_course: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: new Date().getFullYear()
    },
    total_students_registered: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_students_dropped_out: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_lessons: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    listed_price: {
      allowNull: false,
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    description: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    thumbnail_link: {
      allowNULL: true,
      type: DataTypes.STRING
    },
    thumbnail_id: {
      allowNULL: true,
      type: DataTypes.STRING
    },
    category_course_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'private'
    }
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Course;
};