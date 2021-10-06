const database = require('../../database');
const jwtService = require('./jwtService');
const hashService = require('./hashService');

const usersService = {};

// Returns list of users
usersService.getUsers = () => {
  const { users } = database;
  return users;
};

// Find user by id. Returns user if found or false.
usersService.getUserById = (id) => {
  const user = database.users.find((element) => element.id === id);
  if (user) {
    return user;
  }
  return false;
};

// Creates new user, returns id on new user
usersService.createUser = async (newUser) => {
  const existingUser = usersService.getUserByEmail(newUser.email);
  if (existingUser) {
    return { error: 'User already exists' };
  }
  const id = database.users.length + 1;
  const hash = await hashService.hash(newUser.password);
  const user = {
    id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    password: hash,
    email: newUser.email,
    role: 'User',
  };
  database.users.push(user);
  return { id };
};

// Updates user
usersService.updateUser = async (user) => {
  const index = database.users.findIndex((element) => element.id === user.id);
  if (user.firstName) {
    database.users[index].firstName = user.firstName;
  }
  if (user.lastName) {
    database.users[index].lastName = user.lastName;
  }
  if (user.email) {
    database.users[index].email = user.email;
  }
  if (user.password) {
    const hash = await hashService.hash(user.password);
    database.users[index].password = hash;
  }
  return true;
};

// Find user by email. Returns user if found or undefined
usersService.getUserByEmail = (email) => {
  const user = database.users.find((element) => element.email === email);
  return user;
};

// Deletes user
usersService.deleteUserById = (id) => {
  const index = database.users.findIndex((element) => element.id === id);
  // Remove user from 'database'
  database.users.splice(index, 1);
  return true;
};

// User login
usersService.login = async (login) => {
  const { email, password } = login;
  const user = usersService.getUserByEmail(email);
  if (!user) return { error: 'No user found' };
  const match = await hashService.compare(password, user.password);
  if (!match) return { error: 'Wrong password' };
  const token = await jwtService.sign(user);
  return { token };
};

module.exports = usersService;
