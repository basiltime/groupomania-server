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
    db.query(accountData, (err, fields) => {
      if (err && (err.code = 'ER_DUP_ENTRY')) { res.status(409).json({message: 'duplicate email'}) } 
      else if (err) {res.status(500).json({message: 'something else went wrong'})}
      else {
      
      console.log('New Account Created')
      let user = fields.insertId
      console.log(user)
      const token = jwt.sign(
        { userId: user },
        process.env.SECRET_ACCESS_KEY,
        { expiresIn: '24h' },
      )
      res.status(200).json({
        userId: user,
        token: token,
      })
    }
    })
  })

}

/* POST Login */
exports.login = (req, res, next) => {
  const loginData = `SELECT * FROM users WHERE email = '${req.body.email}';`
  db.query(loginData, (err, results) => {
    if (err) throw err
    
    if (results[0] === undefined) {
      res.status(401).json({
        message: "Invalid email."
      })

    } else {
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
        res.status(401).json({
          message: "Incorrect password"
        })
      }
    })
  }
  })
}

exports.viewAccount = (req, res, next) => {
  const userData = `SELECT * FROM users WHERE userId = '${req.params.id}'`;

  db.query(userData, (err, results) => {
    let user = results[0]
    if (err) throw err
    res.status(200).json({
      firstName: `${user.firstName}`,
      lastName: `${user.lastName}`,
      email: `${user.email}`
    })
  })
 
}

exports.deleteAccount = (req, res, next) => {
  const deleteUser = `DELETE FROM users WHERE userId = '${req.params.id}'`;

  db.query(deleteUser, (err, results) => {
    if (err) throw err
    res.status(200).json({
      message: 'Account successfully deleted'
    })
  })
}