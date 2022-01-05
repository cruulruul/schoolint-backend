const express = require('express');
const cors = require('cors');
const { usersController } = require('../controllers');
const { isAdmin, isLoggedIn } = require('../middlewares');

const router = express.Router();

/**
 * Users API endpoints
 */
router
  .use(cors())
  .post('/login', usersController.login)
  .use(isLoggedIn)
  .get('/', isAdmin, usersController.getUsers)
  .get('/:id', isAdmin, usersController.getUserById)
  .post('/', isAdmin, usersController.createUser)
  .patch('/:id', isAdmin, usersController.updateUser)
  .delete('/:id', isAdmin, usersController.deleteUserById);

module.exports = router;
