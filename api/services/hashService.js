const bcrypt = require('bcrypt');
const { saltRounds } = require('../../config');

const hashService = {};

hashService.hash = async (password) => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

hashService.compare = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

module.exports = hashService;
