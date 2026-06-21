'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Teacher.belongsTo(models.User, {
        foreignKey: 'id',
        as: 'teacher_user'
      });
      Teacher.belongsToMany(models.TeacherClass, {
        through: 'teacher_class',
        foreignKey: 'teacher_id'
      });
      Teacher.hasMany(models.Assignment, {
        foreignKey: 'teacher_id'
      });
      Teacher.hasMany(models.MonthlyTeacherSalary, {
        foreignKey: 'teacher_id'
      })
    }
  }
  Teacher.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_name: {
      allowNull: false,
      type: DataTypes.STRING(50),
      unique: true
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    full_name: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    birthday: {
      allowNull: true,
      type: DataTypes.DATE
    },
    sex: {
      allowNull: true,
      type: DataTypes.STRING(10)
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING(100),
      unique: true
    },
    phone: {
      allowNull: false,
      type: DataTypes.STRING(20),
      unique: true
    },
    avatar_link: {
      allowNull: true,
      type: DataTypes.STRING
    },
    avatar_id: {
      allowNull: true,
      type: DataTypes.STRING
    },
    address: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    balance: {
      allowNull: false,
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    thumbnail_link: {
      allowNull: true,
      type: DataTypes.STRING
    },
    thumbnail_id: {
      allowNull: true,
      type: DataTypes.STRING
    },
    description: {
      allowNull: true,
      type: DataTypes.JSON,
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
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'private'
    }
  }, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'teachers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Teacher;
};