'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Coupon.hasOne(models.TuitionFee, {
        foreignKey: 'coupon_id'
      });
      Coupon.belongsToMany(models.Parent, {
        through: 'parent-coupon',
        foreignKey: 'parent_id'
      });
    }
  }
  Coupon.init({
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
    discount: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    start: {
      allowNull: true,
      type: DataTypes.DATE
    }, end: {
      allowNull: true,
      type: DataTypes.DATE
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING
    },
    number_of_users: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'Coupon',
    tableName: 'coupons',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true
  });
  return Coupon;
};