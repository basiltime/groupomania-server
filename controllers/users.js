const db = require('../database-connection/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const aws = require('aws-sdk');
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-2",
});

/* Create Account */
exports.signup = (req, res, next) => {
  // Check if there is a file before submitting values to database. If not, set the profilePicUrl as null.
  let profilePic = ''
  if (req.file) {
    profilePic = req.file.location
    s3ImageKey = req.file.key
  } else {
    profilePic = 'no-photo.png'
    s3ImageKey = null
  }
  bcrypt.hash(req.body.password, 10).then((hash) => {
    db.execute(
      'INSERT INTO users ( firstName, lastName, email, password, profilePicUrl, s3ImageKey ) VALUES (?, ?, ?, ?, ?, ?)',
      [
        `${req.body.firstName}`,
        `${req.body.lastName}`,
        `${req.body.email}`,
        `${hash}`,
        `${profilePic}`,
        `${s3ImageKey}`
      ],
      (err, fields) => {
        if (err && (err.code = 'ER_DUP_ENTRY')) {
          res.status(409).json({ message: 'duplicate email' })
        } else if (err) {
          res.status(500).json({ message: 'something else went wrong' })
        } else {
          console.log('New Account Created')
          console.log(req.file.key)
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
        profilePicUrl: `${user.profilePicUrl}`,
      })
    },
  )
}

/* Delete Account */
exports.deleteAccount = (req, res, next) => {

  db.execute(
    `SELECT s3ImageKey
  FROM users
  WHERE users.userId = ?`,
    [`${req.params.id}`],
    (err, results) => {
      if (err) throw err
     const params = {  Bucket: 'groupomania-images', Key: results[0].s3ImageKey };
      s3.deleteObject(params, function(err) {
        if (err) console.log(err, err.stack);  
        else     console.log('Deleted');                
      });

      db.execute(
        `SELECT s3ImageKey
      FROM posts
      WHERE posts.userId = ?`,
        [`${req.params.id}`],
        (err, results) => {
          if (err) throw err
         const params = {  Bucket: 'groupomania-images', Key: results[0].s3ImageKey };
          s3.deleteObject(params, function(err) {
            if (err) console.log(err, err.stack);  
            else     console.log('Deleted');                
          });


          db.execute(
            'DELETE FROM users WHERE userId = ?',
            [`${req.params.id}`],
            (err) => {
              if (err) throw err
              res.status(200).json({
                message: results,
              })
            },
          )

        })
    },
  )
}

// `SELECT profilePicUrl, multimediaUrl
// FROM users
// LEFT OUTER JOIN posts
// ON users.userId = posts.userId
// WHERE users.userId = ?`,
