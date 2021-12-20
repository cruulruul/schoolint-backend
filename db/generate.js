const mysql = require('mysql2');
const fs = require('fs');
const { db } = require('../config');

console.log('Reading generate.sql');
// Read SQL generation script
const generateQuery = fs.readFileSync('db/generate.sql', {
  encoding: 'utf-8',
});

// Connect to database
const connection = mysql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
  multipleStatements: true,
});

connection.connect();

console.log('Running generate.sql');

// Run seed query
connection.query(generateQuery, (err) => {
  if (err) {
    throw err;
  }
  console.log('generate.sql completed!');
  connection.end();
});
