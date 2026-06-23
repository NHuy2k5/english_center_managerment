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
        foreignKey: 'category_course_id',
        as: 'course_in_category'
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
    description: {
      allowNull: true,
      type: DataTypes.TEXT,
      get() {
        const value = this.getDataValue('description');
        return value
          ? JSON.parse(value)
          : null;
      },
      set(value) {
        this.setDataValue(
          'description',
          JSON.stringify(value)
        );
      }
    },
    thumbnail_link: {
      allowNull: true,
      type: DataTypes.STRING
    },
    thumbnail_id: {
      allowNull: true,
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
    updatedAt: 'updated_at',
    paranoid: true
  });
  return Course;
};