'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lesson.belongsToMany(models.Student, {
        through: 'student_lesson',
        foreignKey: 'lesson_id'
      });
      Lesson.belongsTo(models.Class, {
        foreignKey: 'class_id'
      });
      Lesson.hasMany(models.Assignment, {
        foreignKey: 'lesson_id'
      });
      Lesson.belongsTo(models.Address, {
        foreignKey: 'address_id'
      });
    }
  }
  Lesson.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    start: {
      allowNull: false,
      type: DataTypes.DATE
    },
    end: {
      allowNull: false,
      type: DataTypes.DATE
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING
    },
    listed_price: {
      allowNull: false,
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    class_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    address_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Lesson',
    tableName: 'lessons',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Lesson;
};