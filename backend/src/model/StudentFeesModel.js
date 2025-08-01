const { DataTypes } = require("sequelize");
const sequelize = require('../database/dbConnection');

const StudentFees = sequelize.define('StudentFees', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    bill_id: {
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
    },
    fees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sms_fees',
            key: 'id'
        }
    },
    term: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payed_date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: 'sms_student_fees',
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

module.exports = StudentFees;