const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employeetracker',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database.');
});

module.exports = db;
