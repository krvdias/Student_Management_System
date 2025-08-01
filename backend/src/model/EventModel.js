const { DataTypes } = require("sequelize");
const sequelize = require('../database/dbConnection');

const Events = sequelize.define('Events', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coordinator: {
        type: DataTypes.STRING,
        allowNull: true
    },
    event_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
},{
    tableName: 'sms_events',
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

module.exports = Events;