const { DataTypes } = require("sequelize");
const sequelize = require('../database/dbConnection');

const GPA = sequelize.define('GPA', {
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
        allowNull: false,
    },
    count: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sms_students',
            key: 'id'
        }
    }
}, {
    tableName: 'sms_gpa',
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

module.exports = GPA;