const express = require('express');
const logger = require('morgan');
const config = require('./config');
const {
  candidatesListsRoutes,
  candidatesResultsRoutes,
  candidatesRoutes,
  candidatesTagsRoutes,
  coursesRoutes,
  templatesRoutes,
  usersRoutes,
} = require('./api/routes');

global.__basedir = __dirname;
const app = express();
app.use(logger('dev'));
const { port } = config || 3001;

// Middleware for creating req.body in express app
app.use(express.json());

// Routes
app.use('/candidates', candidatesRoutes);
app.use('/courses', coursesRoutes);
app.use('/lists', candidatesListsRoutes);
app.use('/results', candidatesResultsRoutes);
app.use('/tags', candidatesTagsRoutes);
app.use('/templates', templatesRoutes);
app.use('/users', usersRoutes);

// In case of wrong route
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

app.listen(port, () => {
  console.log(`Back-end server is running on: ${port}`);
});
