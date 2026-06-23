'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Admin.belongsTo(models.User, {
                foreignKey: 'id',
                as: 'admin_user'
            });
        }
    }
    Admin.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        config: {
            allowNull: true,
            type: DataTypes.TEXT,
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
        }
    }, {
        sequelize,
        modelName: 'Admin',
        tableName: 'admins',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true
    });
    return Admin;
};