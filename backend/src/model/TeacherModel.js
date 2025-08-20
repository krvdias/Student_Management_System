const { DataTypes } = require("sequelize");
const sequelize = require('../database/dbConnection');

const Teachers = sequelize.define('Teachers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    training: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    tableName: 'sms_teacher',
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

module.exports = Teachers;