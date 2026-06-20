'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Registration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Registration.belongsTo(models.CategoryCourse, {
        foreignKey: 'category_course_id'
      });
    }
  }
  Registration.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    full_name: {
      allowNull: true,
      type: DataTypes.STRING(50)
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING(100),
      unique: true
    },
    phone: {
      allowNULL: false,
      type: DataTypes.STRING(20),
      unique: true
    },
    address: {
      allowNULL: false,
      type: DataTypes.STRING(100)
    },
    category_course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Registration',
  });
  return Registration;
};