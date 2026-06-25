const router = require('../routes/route');
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const {startSessionCleanupJob} = require('../cron/sessionCleanup');
const { startGenerateSalaryJob } = require('../cron/autoGenerateSalary');
const app = express();
dotenv.config();
// config cors
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "credentials": true,
    "preflightContinue": true,
}));

// config res.body
app.use(express.json());

// khai báo route
try {
    startGenerateSalaryJob();
    startSessionCleanupJob();
    app.use("/api/v1", router);
} catch (error) {
    console.log(error);
}

process.on('uncaughtException', (err) => {
    console.error('uncaughtException:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('unhandledRejection:', err);
});

module.exports = app;