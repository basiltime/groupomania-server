const db = require('../database-connection/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')


/* Create Account */
exports.signup = (req, res, next) => {
  // Check if there is a file before submitting values to database. If not, set the profilePicUrl as null.
  let profilePic = ""
  if (req.file) {profilePic = req.file.location}
  else {profilePic = 'images/no-photo.png'}
  bcrypt.hash(req.body.password, 10).then((hash) => {
    db.execute(
      'INSERT INTO users ( firstName, lastName, email, password, profilePicUrl ) VALUES (?, ?, ?, ?, ?)',
      [
        `${req.body.firstName}`,
        `${req.body.lastName}`,
        `${req.body.email}`,
        `${hash}`,
        `${profilePic}`
      ],
      (err, fields) => {
        if (err && (err.code = 'ER_DUP_ENTRY')) {
          res.status(409).json({ message: 'duplicate email' })
        } else if (err) {
          res.status(500).json({ message: 'something else went wrong' })
        } else {
          console.log('New Account Created')
          let user = fields.insertId
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
      },
    )
  })
}


/* Login */
exports.login = (req, res, next) => {
  db.execute(
    'SELECT * FROM users WHERE email = ?',
    [`${req.body.email}`],
    (err, results) => {
      if (err) throw err
      if (results[0] === undefined) {
        res.status(401).json({
          message: 'Invalid email.',
        })
      } else {
        let user = results[0]
        bcrypt.compare(req.body.password, user.password, function (
          err,
          response,
        ) {
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
              message: 'Incorrect password',
            })
          }
        })
      }
    },
  )
}

/* View Account */
exports.viewAccount = (req, res, next) => {
  db.execute(
    'SELECT * FROM users WHERE userId = ?',
    [`${req.params.id}`],
    (err, results) => {
      let user = results[0]
      if (err) throw err
      res.status(200).json({
        firstName: `${user.firstName}`,
        lastName: `${user.lastName}`,
        email: `${user.email}`,
        profilePicUrl: `${user.profilePicUrl}`
      })
    },
  )
}

/* Delete Account */
exports.deleteAccount = (req, res, next) => {
  db.execute(
    'DELETE FROM users WHERE userId = ?',
    [`${req.params.id}`],
    (err) => {
      if (err) throw err
      res.status(200).json({
        message: 'Account successfully deleted',
      })
    },
  )
}
