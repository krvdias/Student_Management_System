const { DataTypes } = require("sequelize");
const sequelize = require('../database/dbConnection');

const Fees = sequelize.define('Fees', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    class: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sms_class',
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'sms_fees',
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

module.exports = Fees;