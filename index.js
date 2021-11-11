/* eslint-disable no-underscore-dangle */
const express = require('express');
const logger = require('morgan');
const config = require('./config');
const {
  usersRoutes,
  candidatesRoutes,
  uploadRoutes,
  resultsRoutes,
  templatesRoutes,
} = require('./api/routes');

global.__basedir = __dirname;
const app = express();
app.use(logger('dev'));
const { port } = config || 3001;

// Middleware for creating req.body in express app
app.use(express.json());
// Routes
app.use('/users', usersRoutes);
app.use('/candidates', candidatesRoutes);
app.use('/upload', uploadRoutes);
app.use('/results', resultsRoutes);
app.use('/templates', templatesRoutes);

app.listen(port, () => {
  console.log(`Back-end server is running on: ${port}`);
});
