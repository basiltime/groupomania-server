const db = require('../database-connection/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

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

    let user = results[0]

    bcrypt.compare(req.body.password, user.password, function (err, response) {
      if (response === true) {
        console.log('Password Matches!')

        const token = jwt.sign(
          { userId: user.userId },
          process.env.SECRET_ACCESS_KEY,
          { expiresIn: '24h' },
        )

        res.status(200).json({
          userId: user.userId,
          token: token,
        })
      } else if (response === false) {
        console.log('Password does not match!!!')
      }
    })
  })
}
