'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsTo(models.User, {
        foreignKey: 'id',
        as: 'student_user'
      });
      Student.belongsToMany(models.Class, {
        through: 'student_class',
        foreignKey: 'student_id'
      });
      Student.belongsToMany(models.Lesson, {
        through: 'student_lesson',
        foreignKey: 'student_id'
      });
      Student.belongsTo(models.Parent, {
        foreignKey: 'parent_id'
      });
      Student.hasMany(models.TuitionFee, {
        foreignKey: 'student_id'
      })
    }
  }
  Student.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    parent_id: {
      allowNull: true,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Student',
    tableName: 'students',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return Student;
};