const express = require('express');
const { usersController } = require('../controllers');
const { validators, isLoggedIn, isAdmin, auth } = require('../middlewares');

const router = express.Router();

/**
 * Users API endpoints
 */
router
  .get('/auth', usersController.loginUrl)
  .post('/auth/getUserData', auth)
  .post('/', usersController.createUser)
  .post('/login', usersController.login)
  .use(isLoggedIn)
  .get('/', isAdmin, usersController.getUsers)
  .get('/:id', isAdmin, validators.getUserById, usersController.getUserById)
  .patch('/:id', isAdmin, usersController.updateUser)
  .delete('/:id', isAdmin, usersController.deleteUserById);

module.exports = router;
