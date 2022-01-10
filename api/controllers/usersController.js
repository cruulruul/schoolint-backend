const { usersService } = require('../services');

const usersController = {};

/**
 * Authenticates the user and returns the bearer token.
 * @param {string} req.body.email
 * @param {string} req.body.password
 * @returns {object} On success returns JSON with token and status 200.
 * On failure returns JSON with error message and status code 400 or 403.
 */
usersController.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email or password missing',
    });
  }
  const login = {
    email,
    password,
  };
  try {
    const data = await usersService.login(login);
    if (data.error) {
      return res.status(403).json({
        error: data.error,
      });
    }
    return res.status(200).json({
      token: data.token,
    });
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to authenticate the user: ${err}`,
    });
  }
};

usersController.getUserRole = async (req, res) => {
  if (!req.userRole) {
    return res.status(404).json({
      error: 'User role not found',
    });
  }
  return res.status(200).json({
    role: req.userRole,
  });
};

/**
 * Returns all users from the database
 * @returns {object} On success returns JSON and status code 200.
 * On failure returns JSON with error msg and status code 500.
 */
usersController.getUsers = async (req, res) => {
  try {
    const users = await usersService.getUsers();
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to fetch the users: ${err}`,
    });
  }
};

/**
 * Returns single user record from the database by Id
 * @param {int} req.params.id
 * @returns {object} On failure returns JSON with error msg and status 404 or 500,
 * On success returns JSON with user data and status code 200
 */
usersController.getUserById = async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to get the user data: ${err}`,
    });
  }
};

/**
 * For creating a new user
 * @param {string} req.body.firstName
 * @param {string} req.body.lastName
 * @param {string} req.body.email
 * @param {string} req.body.password
 * @param {int} [req.body.courseId] - Optional
 * @param {int} [req.body.roleId] - Optional
 * @returns {object} On failure returns JSON with error msg and status code 400, 409 or 500.
 * On success returns JSON with created user Id and status 200
 */
usersController.createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    specialityCode,
    roleId,
  } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      error: 'Required data is missing.',
    });
  }

  try {
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
      specialityCode,
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
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to create the user: ${err}`,
    });
  }
};

/**
 * Updates the user by id. At least one param needed!
 * @param {string} [req.body.firstName] - Optional
 * @param {string} [req.body.lastName] - Optional
 * @param {string} [req.body.email] - Optional
 * @param {string} [req.body.password] - Optional
 * @param {int} [req.body.couseId] - Optional
 * @param {int} [req.body.roleId] - Optional
 * @returns {object} On success returns JSON with msg success=true.
 * On failure returns JSON with error msg and status code 400, 404 or 500.
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
  try {
    const user = usersService.getUserById(id);
    if (!user) {
      res.status(404).json({
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
        error: 'An internal error occurred while trying to update the user',
      });
    }
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to update the user: ${err}`,
    });
  }
};

/**
 * Deletes the user by id.
 * @param {int} req.params.id
 * @returns {object} On success returns status code 204.
 * On failure returns JSON with error msg and status code 400, 404 or 500.
 */
usersController.deleteUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({
      error: `Not valid id: ${id}`,
    });
  }
  try {
    // Check if user exists
    const user = await usersService.getUserById(id);
    if (!user) {
      return res.status(404).json({
        error: `No user found with id: ${id}`,
      });
    }
    const success = await usersService.deleteUserById(id);
    if (!success) {
      return res.status(500).json({
        error: 'An internal error occurred while trying to delete the user',
      });
    }
    return res.status(204).end();
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to delete the user: ${err}`,
    });
  }
};

module.exports = usersController;
