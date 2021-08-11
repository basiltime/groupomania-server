const express = require('express')
const db = require('../database-connection/db')
const bcrypt = require('bcryptjs')

/* POST Create Account */
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const data = `INSERT INTO users
        ( firstName, 
          lastName, 
          email, 
          password ) 
VALUES ( '${req.body.firstName}',
         '${req.body.lastName}', 
         '${req.body.email}', 
         '${hash}' )`
    db.query(data, (err, rows) => {
      if (err) throw err
      console.log('New Account Created')
    })
    .then(
        res.status(201).json({
        message: 'User added successfully!'
      }))
  }).catch(
      (error) => {
        res.status(500).json({
            error: error
            })
      }
  )
}














  