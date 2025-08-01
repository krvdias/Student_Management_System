const { DataTypes } = require("sequelize");
const sequelize = require('../database/dbConnection');

const Class = sequelize.define('Class', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    year: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'sms_class',
    timestamps: true,
    updatedAt: true,
    createdAt: true, 
});

module.exports = Class;