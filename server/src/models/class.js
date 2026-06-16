'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Class.belongsToMany(models.Student, {
        through: 'StudentClass',
        foreignKey: 'class_id'
      });
      Class.belongsToMany(models.Teacher, {
        through: 'TeacherClass',
        foreignKey: 'class_id'
      });
      Class.belongsTo(models.Course, {
        foreignKey: 'course_id'
      });
      Class.hasMany(models.Lesson, {
        foreignKey: 'class_id'
      });
      Class.hasMany(models.TuitionFee, {
        foreignKey: 'class_id'
      });
    }
  }
  Class.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
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
    course_id: {
      allowNull: true,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Class',
    tableName: 'classes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Class;
};