const config = {
  port: 3001,
  saltRounds: 10,
  jwtSecret: 'secret',
  baseDir: __dirname,
  db: {
    host: 'localhost',
    user: 'root',
    password: '',
  },
};

module.exports = config;
