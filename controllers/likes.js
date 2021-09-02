const { restart } = require('nodemon')
const db = require('../database-connection/db')

exports.like = (req, res, next) => {
  // Request body contains userId and postId. If the user hasn't already liked the post, 
  // their like is inserted into the database. Else, their like is removed.
  db.query(
    `SELECT * FROM likes WHERE postId = ${req.body.postId} AND userId = ${req.body.userId}`,
    (err, results) => {
      if (results.length == 0) {
        db.query(
          `INSERT INTO likes ( postId, userId ) VALUES ( ${req.body.postId}, ${req.body.userId} );`,
          (err, results) => {},
        )
        res.status(200).json({
          message: 'Post was liked!',
        })
      } else if (!results.length == 0) {
        db.query(
          `DELETE FROM likes WHERE ( postId, userId ) = ( ${req.body.postId}, ${req.body.userId} );`,
          (err, results) => {},
        )
        res.status(200).json({
          message: 'Like removed!',
        })
      }
    },
  )
}

exports.getAllLikes = (req, res, next) => {
  db.query(`SELECT * FROM likes`, (err, results) => {
      res.status(200).json({
          data: results
      })
  })
}
