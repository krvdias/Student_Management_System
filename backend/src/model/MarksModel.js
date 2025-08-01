const { DataTypes } = require("sequelize");
const sequelize = require('../database/dbConnection');

const Marks = sequelize.define('Marks', {
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
    term: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    marks: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    subject: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'sms_subjects',
            key: 'id'
        }
    },
    student: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'sms_students',
            key: 'id'
        }
    }
}, {
    tableName: 'sms_marks',
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

module.exports = Marks;