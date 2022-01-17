const mysql = require('mysql2');
const util = require('util');
const { db } = require('./config');

const pool = mysql.createPool({
  host: db.host,
  user: db.user,
  database: 'schoolint',
  password: db.password,
  connectionLimit: 100,
});

pool.query = util.promisify(pool.query);

pool.getConnection((err, connection) => {
  if (err) {
    throw err;
  }
  console.log('Database connected successfully');
  connection.release();
});

module.exports = pool;
