const { Sequelize } = require("sequelize");
const process = require("process");
require('dotenv').config(); // Ensure the .env file is being read

const sequelize = new Sequelize(
    process.env.USER_DB_NAME,
    process.env.MAIN_DB_USER,
    process.env.MAIN_DB_PASSWORD,
    {
        dialect: 'mysql',
        host: process.env.MAIN_DB_HOST,
        pool: {
            min: parseInt(process.env.DB_POOL_MIN) || 1,
            max: parseInt(process.env.DB_POOL_MAX) || 10
        },
        logging: false,
        timezone: 'Asia/Colombo',
        dialectOptions: {
            timezone: 'local'
        },
        sync: {
            force: false,
            alter: false
        }
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully');
    })
    .catch(err => {
        console.error('Unable to connect to the database: ', err);
    });

module.exports = sequelize;