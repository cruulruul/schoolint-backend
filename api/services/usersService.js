const jwtService = require('./jwtService');
const hashService = require('./hashService');
const db = require('../../db');

const usersService = {};

/**
 * All users query from the database
 * @returns {json} If no records found returns empty JSON.
 * On success returns JSON
 */
usersService.getUsers = async () => {
  const users = await db.query(
    `SELECT
      U.id, U.first_name as firstName, U.last_name as lastName, U.email, UR.name as role, C.name as specialityCode
    FROM
      User U
    INNER JOIN
      UserRole UR on U.UserRole_id=UR.id
    LEFT JOIN
      Course C on U.Course_id=C.id
    WHERE
      U.deleted=0;`,
  );
  return users;
};

/**
 * Single user query from the database by id
 * @param {any} id
 * @returns {any}
 * If no records found returns false.
 * On success returns JSON.
 */
usersService.getUserById = async (id) => {
  const user = await db.query(
    `SELECT
      U.id, U.first_name as firstName, U.last_name as lastName, U.email, UR.name as role, C.name as specialityCode
    FROM
      User U
    INNER JOIN
      UserRole UR on U.UserRole_id=UR.id
    LEFT JOIN
      Course C on U.Course_id=C.id
    WHERE
      U.id = ? and
      U.deleted=0;`,
    [id],
  );
  if (!user[0]) return false;
  return user[0];
};

/**
 * Hash's the password and creates new user
 * @param {json} newUser
 * @returns {json}
 * Returns created user Id
 */
usersService.createUser = async (newUser) => {
  const existingUser = await usersService.getUserByEmail(newUser.email);
  if (existingUser) {
    return { error: `User with email ${newUser.email} already exists` };
  }

  const hash = await hashService.hash(newUser.password);
  const user = {
    first_name: newUser.firstName,
    last_name: newUser.lastName,
    password: hash,
    email: newUser.email,
    UserRole_id: newUser.roledId ? newUser.roledId : 2,
    Course_id: newUser.Course_id,
  };
  const result = await db.query('INSERT INTO User SET ?', [user]);
  return { id: result.insertId };
};

/**
 * Updates the user record by Id
 * @param {json} user
 * @returns {boolean}
 * On success returns true on failure false.
 */
usersService.updateUser = async (user) => {
  const userToUpdate = {};
  if (user.firstName) {
    userToUpdate.first_name = user.firstName;
  }
  if (user.lastName) {
    userToUpdate.last_name = user.lastName;
  }
  if (user.email) {
    userToUpdate.email = user.email;
  }
  if (user.password) {
    const hash = await hashService.hash(user.password);
    userToUpdate.password = hash;
  }
  if (user.courseId) {
    userToUpdate.Course_id = user.courseId;
  }
  if (user.roleId) {
    userToUpdate.UserRole_id = user.roleId;
  }
  const result = await db.query('UPDATE User SET ? WHERE id = ?', [
    userToUpdate,
    user.id,
  ]);
  if (result.affectedRows === 1) {
    return true;
  }
  return false;
};

/**
 * Single user query from the database by email
 * @param {string} email
 * @returns {(json|boolean)}
 * If no records found returns false.
 * On success returns JSON.
 */
usersService.getUserByEmail = async (email) => {
  const user = await db.query(
    `SELECT
      U.id, U.email, UR.name as role, U.password
    FROM
      User U
    INNER JOIN
      UserRole UR on U.UserRole_id=UR.id
    LEFT JOIN
      Course C on U.Course_id=C.id
    WHERE
      U.email = ? and
      U.deleted=0;`,
    [email],
  );
  if (!user[0]) return false;
  return user[0];
};

/**
 * Deletes the user record from the database by id
 * @param {int} id
 * @returns {boolena}
 */
usersService.deleteUserById = async (id) => {
  const result = await db.query('UPDATE User SET deleted = 1 WHERE id = ?', [
    id,
  ]);
  if (result.affectedRows === 1) {
    return true;
  }
  return false;
};

/**
 * Compares the login credentials and returns the bearer token
 * @param {json} login
 * @returns {json} On success returns JSON with token.
 * On failure returns JSON with error message.
 */
usersService.login = async (login) => {
  const { email, password } = login;
  const user = await usersService.getUserByEmail(email);
  if (!user) return { error: 'No user found' };
  const match = await hashService.compare(password, user.password);
  if (!match) return { error: 'Wrong password' };
  const token = await jwtService.sign(user);
  return { token };
};

module.exports = usersService;
