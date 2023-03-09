const express = require('express');
const app = express();

const dotenv = require('dotenv');

const connectDatabase = require('./config/database');

//Setting up config.env file vars
dotenv.config({path: "./config/config.env"})

//Connect to database
connectDatabase();

//Importing all routes
const jobs = require('./routes/jobs');

app.use('/api/v1', jobs);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});