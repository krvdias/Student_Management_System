const { DataTypes } = require("sequelize");
const sequelize = require('../database/dbConnection');

const Students = sequelize.define('Students', {
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
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gardian: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    religion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    thired_or_upper: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    teacher_child: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    register_no: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    addmission_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    class: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sms_class',
            key: 'id'
        }
    },
    leave_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    }
}, {
    tableName: 'sms_students',
    timestamps: true,
    updatedAt: true,
    createdAt: true,
});

module.exports = Students;