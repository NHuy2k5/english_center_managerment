const express = require('express');
const dotenv = require('dotenv');
const router = require('./routes/route');

const app = express();
dotenv.config();
const port = process.env.PORT || 5003;

// config res.body
app.use(express.json());

// khai báo route
app.use("/api/v1", router);

app.listen(port, () => {
    console.log(`Server is actived on port ${port}`);
})