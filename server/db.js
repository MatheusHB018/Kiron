const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // ajuste conforme seu usuário do MySQL
  password: '', // ajuste conforme sua senha do MySQL
  database: 'medresiduos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
