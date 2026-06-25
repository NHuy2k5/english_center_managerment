const app = require('./app/app');
const port = process.env.PORT || 5003;
app.listen(port, () => {
    console.log(`Server is actived on port ${port}`);
})