const express = require('express');
const app = express();

const dotenv = require('dotenv');

const connectDatabase = require('./config/database');
const errorMiddleware = require('./middlewares/errors');
const ErrorHandler = require('./utils/errorHandler');

//Setting up config.env file vars
dotenv.config({path: "./config/config.env"})

//Handling uncaught exception
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down due to uncaught exception.');
    process.exit(1);
});

//Connect to database
connectDatabase();

// Setup bodyparser
app.use(express.json());

//Creating own middleware
/* const middleware = (req, res, next) => {
    console.log('Hello from middleware.');

    //Set up user variable globally
    // req.user = "John Smith";
    req.requestMethod = req.method;
    next();
}

app.use(middleware); */

//Importing all routes
const jobs = require('./routes/jobs');

//Routes
app.use('/api/v1', jobs);
//Wildcard route should be after all other routes, otherwise it will catch everything.
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

//Middleware to handle errors
app.use(errorMiddleware);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

// Handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
    console.log(`Error ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection.');
    server.close(() => {
        process.exit(1);
    });
});

// Line to test uncaught exception handler
// console.log(uiasgfhuoainf);