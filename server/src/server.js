const express = require('express');
const dotenv = require('dotenv');
const router = require('./routes/route');
const cors = require('cors');

const app = express();
dotenv.config();
const {startSessionCleanupJob} = require('./cron/sessionCleanup');
const port = process.env.PORT || 5003;

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
    startSessionCleanupJob();
    app.use("/api/v1", router);
} catch (error) {
    console.log(error);
}

app.listen(port, () => {
    console.log(`Server is actived on port ${port}`);
})