const mysql = require('mysql2')



// Create Connection
const db = mysql.createPool({
  connectionLimit: 4,
  host      : process.env.DB_HOST,
  user      : process.env.DB_USER,
  password  : process.env.DB_PASSWORD,
  database  : process.env.DB_DATABASE,
  multipleStatements: true
  })

module.exports = db;