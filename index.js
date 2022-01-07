const express = require('express');
const logger = require('morgan');
const config = require('./config');
const {
  usersRoutes,
  candidatesRoutes,
  resultsRoutes,
  templatesRoutes,
  candidatesListsRoutes,
  candidatesTagsRoutes,
  coursesRoutes,
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
app.use('/courses', coursesRoutes);
app.use('/results', resultsRoutes);
app.use('/templates', templatesRoutes);
app.use('/lists', candidatesListsRoutes);
app.use('/tags', candidatesTagsRoutes);

// In case of wrong route
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

app.listen(port, () => {
  console.log(`Back-end server is running on: ${port}`);
});
