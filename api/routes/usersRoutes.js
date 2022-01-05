const express = require('express');
const cors = require('cors');
const { usersController } = require('../controllers');
const { validators, isAdmin } = require('../middlewares');

const router = express.Router();

/**
 * Users API endpoints
 */
router
  .use(cors())
  .post('/login', usersController.login)
  // .use(isLoggedIn)
  .get('/', usersController.getUsers)
  // .get('/', isAdmin, usersController.getUsers)
  .get('/:id', validators.getUserById, usersController.getUserById)
  .post('/', usersController.createUser)
  // .post('/', isAdmin, usersController.createUser)
  .patch('/:id', isAdmin, usersController.updateUser)
  .delete('/:id', isAdmin, usersController.deleteUserById);

module.exports = router;
