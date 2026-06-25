'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentClass.belongsTo(models.Student, {
        foreignKey: 'student_id'
      });
      StudentClass.belongsTo(models.Class, {
        foreignKey: 'class_id'
      })
    }
  }
  StudentClass.init({
    student_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    class_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    enrolled_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    left_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'StudentClass',
    tableName: 'student_class',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return StudentClass;
};