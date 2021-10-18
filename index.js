const express = require('express');
const config = require('./config');
const {
  usersRoutes,
  candidatesRoutes,
  excelImportRoutes
} = require('./api/routes');
const { logger } = require('./api/middlewares');

const app = express();
const { port } = config || 3001;

// Middleware for creating req.body in express app
app.use(express.json());
// Logger middleware
app.use(logger);
// Routes
app.use('/users', usersRoutes);
app.use('/candidates', candidatesRoutes);
app.use('/import', excelImportRoutes);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on: ${port}`);
});
