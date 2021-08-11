const mysql = require('mysql2')

// Create Connection
const db = mysql.createConnection({
    host      : process.env.DB_HOST,
    user      : process.env.DB_USER,
    password  : process.env.DB_PASS,
    database  : 'groupomania'
  })

module.exports = db;