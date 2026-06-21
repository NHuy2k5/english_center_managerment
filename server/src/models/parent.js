'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Parent.belongsTo(models.User, {
        foreignKey: 'id',
        as: 'parent_user'
      })
      Parent.hasMany(models.Student, {
        foreignKey: 'parent_id'
      });
      Parent.belongsToMany(models.Coupon, {
        through: 'parent-coupon',
        foreignKey: 'coupon_id'
      });
    }
  }
  Parent.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    balance: {
      allowNull: false,
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'Parent',
    tableName: 'parents',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Parent;
};