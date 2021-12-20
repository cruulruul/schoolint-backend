const config = {
  port: 3001,
  saltRounds: 10,
  jwtSecret: 'secret',
  baseDir: __dirname,
  db: {
    host: '',
    user: '',
    password: '',
  },
};

module.exports = config;
