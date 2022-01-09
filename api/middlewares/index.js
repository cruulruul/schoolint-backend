const validators = require('./validators');
const isLoggedIn = require('./isLoggedIn');
const isAdmin = require('./isAdmin');
const upload = require('./upload');
const auth = require('./auth');

module.exports = {
  validators,
  isLoggedIn,
  isAdmin,
  upload,
  auth,
};
