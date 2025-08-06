const express = require('express');
const sequelize = require('./database/dbConnection');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const Admin = require('./model/AdminModel');
require('./model/Associations');
const startPaymentStatusCronJob = require('./auto/crons');

const origine = process.env.FRONTEND_ORINGINE;
const PORT = 3010;
const app = express();

// Middleware
app.use(cors()); 
app.use(cors({ origin: `${origine}`, credentials: true }));
app.use(express.json()); 
app.use(bodyParser.json({ limit: '100kb' }));

// Routes
app.use('/api/admin', adminRoutes);

// Handle 404 errors (route not found)
app.use((req, res) => {
    res.status(404).send('Route not found ...');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server and test the database connection
class App {

    constructor() {
        this.app = app;
        this.port = PORT;
        app.locals.appInstance = this;
    }

    async initializeDatabase() {
        try {
            await sequelize.authenticate();
            console.log('Database connection has been established succesfully.');
            await sequelize.sync({ alter: true });
            console.log('Database synchronized successfully.');
        } catch (error) {
            console.error('Error during database initialization: ', error);
            throw error;
        }
    }

    async initializeAdmin() {
        try {
            const adminExists = await Admin.findOne({ where: { username: 'admin' } });
            if (!adminExists) {
                await Admin.create({
                    username: 'admin',
                    password: 'admin123',
                    email: 'admin@example.com'
                });
                console.log('Default admin user created');
            }
            console.log('Admin is Exist');
        } catch (error) {
            console.error('Error creating admin user:', error);
            throw error;
        }
    }

    async startServer() {
        try {
            await this.initializeDatabase();
            await this.initializeAdmin();

            startPaymentStatusCronJob();

            this.app.listen(this.port, () => {
                console.log(`Server is running on port ${this.port}`);
            });
        } catch (error) {
            console.error('Error during startup: ', error);
            process.exit(1);
        }
    }
    
}

const appInstance = new App();
(async () => {
    try {
        await appInstance.startServer();
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
})();