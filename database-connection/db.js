const mysql = require('mysql2')



// Create Connection
const db = mysql.createConnection({
  host      : 'us-cdbr-east-04.cleardb.com',
  user      : 'b1e90c8bcbdf6f',
  password  : 'ba142b90',
  database  : 'heroku_d41279214193bc7',
  })

module.exports = db;