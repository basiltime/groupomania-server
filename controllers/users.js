const express = require('express')
const db = require('../database-connection/db')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')

/* POST Create Account */
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const accountData = `INSERT INTO users
        ( firstName, 
          lastName, 
          email, 
          password ) 
VALUES ( '${req.body.firstName}',
         '${req.body.lastName}', 
         '${req.body.email}', 
         '${hash}' )`
    db.query(accountData, (err, rows) => {
      if (err) throw err
      console.log('New Account Created')
    })
   
  })
}



exports.login = (req, res, next) => {
    const loginData = `SELECT * FROM users WHERE email = '${req.body.email}';`
    db.query(loginData, (err, results) => {
    if (err) throw err
    console.log(req.body.email)
    console.log(results[0].password)
  
    bcrypt.compare(req.body.password, results[0].password, function(err, response) {
        if (response === true) {console.log('Password Matches!'); const token = jwt.sign(
            { email: req.body.email },
            'E36FOKN9EjDASoGqoNUQwrpjHeNoLpJ9h4a7ACAzpHjZ3nbHpQaejjEFAGcFxn4',
            { expiresIn: '24h' });
          res.status(200).json({
            email: req.body.email,
            token: token
          });} 
        else if (response === false) {console.log('Password does not match!!!')}
    });
})  

}





  