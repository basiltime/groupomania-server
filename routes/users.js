const express = require('express')
const router = express.Router()
const db = require('../database-connection/db')





/* POST new user  */
router.post('/', function(req, res, next) {
const data =  
`INSERT INTO users
        ( firstName, 
          lastName, 
          email, 
          password ) 
VALUES ( '${req.body.firstName}',
         '${req.body.lastName}', 
         '${req.body.email}', 
         '${req.body.password}' )`;
  db.query(data, (err,rows) => {
    if(err) throw err;
    console.log('New Account Created');
  });

})


module.exports = router;
