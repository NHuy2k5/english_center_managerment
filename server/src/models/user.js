'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Student, {
        foreignKey: 'id'
      });
      User.hasOne(models.Parent, {
        foreignKey: 'id'
      });
      User.hasOne(models.Teacher, {
        foreignKey: 'id'
      });
      User.belongsToMany(models.Role, {
        through: 'user_role',
        foreignKey: 'user_id'
      });
      User.hasOne(models.Session, {
        foreignKey: 'user_id'
      });
      User.hasMany(models.Notification, {
        foreignKey: 'user_id'
      })
    }
  }
  User.init({
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
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true
  });
  return User;
};