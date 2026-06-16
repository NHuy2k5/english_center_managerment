'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParentCoupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ParentCoupon.init({
    parent_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    coupon_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    }
    }, {
    sequelize,
    modelName: 'ParentCoupon',
    tableName: 'parent_coupon',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return ParentCoupon;
};