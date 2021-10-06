const express = require('express');
const config = require('./config');
const {
  usersRoutes,
} = require('./api/routes');
const { logger } = require('./api/middlewares');

const app = express();
const { port } = config || 3000;

// Middleware for creating req.body in express app
app.use(express.json());
// Logger middleware
app.use(logger);
// Routes
app.use('/users', usersRoutes);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on: ${port}`);
});
