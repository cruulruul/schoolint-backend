const config = {
  port: 3001,
  saltRounds: 10,
  jwtSecret: 'slkajdlkasdlaks',
  baseDir: __dirname,
  db: {
    host: 'localhost',
    user: 'root',
    password: 'pass',
  },
};

module.exports = config;
