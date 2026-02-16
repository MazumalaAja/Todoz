// Express-setup
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

// My-setup
const welcome = require("./app/api/routes/welcome.route");
const auth = require("./app/api/routes/auth.route");
const errorMiddleware = require('./app/middleware/errorMiddleware');
const { notFoundMiddleware } = require('./app/middleware/notFoundMiddleware');
const users = require("./app/api/routes/users.route");
const baseURL = "/api/"

// Express-setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// My-setup
app.use(baseURL, welcome);
app.use(baseURL, auth);
app.use(baseURL, users);
app.use(errorMiddleware);
app.use(notFoundMiddleware);

// Export
module.exports = app;
