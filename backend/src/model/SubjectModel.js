const { DataTypes } = require("sequelize");
const sequelize = require('../database/dbConnection');

const Subjects = sequelize.define('Subjects', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    subject_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'sms_subjects',
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

module.exports = Subjects;