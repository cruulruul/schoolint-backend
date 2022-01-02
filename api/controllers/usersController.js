const { usersService } = require('../services');

const usersController = {};

/**
 * Get all users
 * GET - /users
 * Required values: none
 * Optional values: none
 * Success: status 200 - OK and list of users
 */
usersController.getUsers = async (req, res) => {
  const users = await usersService.getUsers();
  res.status(200).json({ users });
};

/**
 * Get user by user id
 * GET - /users/:id
 * Required values: id
 * Optional values: none
 * Success: status 200 - OK and user with specified id
 * Error: status 400 - Bad Request and error message
 */
usersController.getUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = await usersService.getUserById(id);
  if (!user) {
    return res.status(404).json({
      error: `No user found with id: ${id}`,
    });
  }
  return res.status(200).json({
    user,
  });
};

/**
 * Create new user
 * POST - /users
 * Required values: firstName, lastName, email, password
 * Optional values: courseId, roleId
 * Success: status 201 - Created and id of created user
 * Error: status 400 - Bad Request and error message
 */
usersController.createUser = async (req, res) => {
  const { firstName, lastName, email, password, courseId, roleId } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      error: 'Required data is missing.',
    });
  }

  const existingUser = await usersService.getUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({
      error: `User with ${email} already exists`,
    });
  }

  const user = {
    firstName,
    lastName,
    email,
    password,
    courseId,
    roleId,
  };

  const data = await usersService.createUser(user);
  if (data.error) {
    return res.status(409).json({
      error: data.error,
    });
  }
  return res.status(201).json({
    id: data.id,
  });
};

/**
 * User login
 * POST - /users
 * Required values: email, password
 * Optional values: none
 * Success: status 200 - OK and token
 * Error: status 400 - Bad Request and error message
 * Error: status 403 - Unauthorized and error message
 */
usersController.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    return res.status(400).json({
      error: 'Email or password missing',
    });
  }
  const login = {
    email,
    password,
  };
  const data = await usersService.login(login);
  if (data.error) {
    return res.status(403).json({
      error: data.error,
    });
  }
  return res.status(200).json({
    token: data.token,
  });
};

/**
 * Update user
 * PATCH - /users/:id
 * Required values: id, firstName OR lastName
 * Optional values: firstName, lastName
 * Success: status 200 - OK and success message
 * Error: status 400 - Bad Request and error message
 * Error: status 500 - Server error and error message
 */
usersController.updateUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { firstName, lastName, email, password, courseId, roleId } = req.body;
  if (!id) {
    return res.status(400).json({
      error: `Not valid id: ${id}`,
    });
  }
  if (!(firstName || lastName || email || password || courseId || roleId)) {
    res.status(400).json({
      error: 'Required data is missing',
    });
  }
  const user = usersService.getUserById(id);
  if (!user) {
    res.status(400).json({
      error: `No user found with id: ${id}`,
    });
  }
  const userToUpdate = {
    id,
    firstName,
    lastName,
    email,
    password,
    courseId,
    roleId,
  };
  const success = await usersService.updateUser(userToUpdate);
  if (!success) {
    return res.status(500).json({
      error: 'Something went wrong while updating user',
    });
  }
  return res.status(200).json({
    success: true,
  });
};

/**
 * Delete user
 * DELETE - /users/:id
 * Required values: id
 * Optional values: none
 * Success: status 204 - No Content
 * Error: status 400 - Bad Request and error message
 * Error: status 500 - Server error and error message
 */
usersController.deleteUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({
      error: `Not valid id: ${id}`,
    });
  }

  // Check if user exists
  const user = await usersService.getUserById(id);
  if (!user) {
    return res.status(400).json({
      error: `No user found with id: ${id}`,
    });
  }
  const success = await usersService.deleteUserById(id);
  if (!success) {
    return res.status(500).json({
      error: 'Something went wrong while deleting the user',
    });
  }
  return res.status(204).end();
};

module.exports = usersController;
