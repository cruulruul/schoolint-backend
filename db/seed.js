const mysql = require('mysql2');
const fs = require('fs');
const { db } = require('../config');

console.log('Reading seed.sql');
// Read SQL seed script
const seedQuery = fs.readFileSync('db/seed.sql', {
  encoding: 'utf-8',
});

// Connect to database
const connection = mysql.createConnection({
  host: db.host,
  user: db.user,
  database: 'schoolint',
  password: db.password,
  multipleStatements: true,
});

console.log('Running seed.sql');

// Run seed query
connection.query(seedQuery, (err) => {
  if (err) {
    throw err;
  }
  console.log('seed.sql completed!');
  connection.end();
});
