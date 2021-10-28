const express = require('express');
const logger = require('morgan');
const config = require('./config');
const {
  usersRoutes,
  candidatesRoutes,
  excelImportRoutes,
  resultsRoutes,
  templatesRoutes,
} = require('./api/routes');

const app = express();
app.use(logger('dev'));
const { port } = config || 3001;

// Middleware for creating req.body in express app
app.use(express.json());
// Routes
app.use('/users', usersRoutes);
app.use('/candidates', candidatesRoutes);
app.use('/import', excelImportRoutes);
app.use('/results', resultsRoutes);
app.use('/templates', templatesRoutes);

app.listen(port, () => {
  console.log(`Back-end server is running on: ${port}`);
});
