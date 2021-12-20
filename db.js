const mysql = require('mysql2');
const util = require('util');
const { db } = require('./config');

const connection = mysql.createConnection({
  host: db.host,
  user: db.user,
  database: 'schoolint',
  password: db.password,
});

connection.query = util.promisify(connection.query);

module.exports = connection;
