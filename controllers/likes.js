
const db = require('../database-connection/db')

exports.like = (req, res, next) => {
  // Request body contains userId and postId. If the user hasn't already liked the post, 
  // their like is inserted into the database. Else, their like is removed.
  db.execute(
    'SELECT * FROM likes WHERE postId = ? AND userId = ?',
    [`${req.body.postId}`, `${req.body.userId}`],
    (err, results) => {
      if (results.length == 0) {
        db.execute(
          'INSERT INTO likes ( postId, userId ) VALUES ( ?, ?)',
          [`${req.body.postId}`, `${req.body.userId}`], 'SELECT * FROM likes',
          (err, results) => {
          res.status(200).json({
              data: results
          })
      })
      } else if (!results.length == 0) {
        db.execute(
          'DELETE FROM likes WHERE ( postId, userId ) = ( ?, ? );', 
          [`${req.body.postId}`, `${req.body.userId}`], (err, results) => {},
        )
        db.execute(`SELECT * FROM likes`, (err, results) => {
          res.status(200).json({
              data: results
          })
      })
      }
    },
  )
}

exports.getAllLikes = (req, res, next) => {
  db.execute(`SELECT * FROM likes`, (err, results) => {
      res.status(200).json({
          data: results
      })
  })
}




// exports.like = (req, res, next) => {
//   // Request body contains userId and postId. If the user hasn't already liked the post, 
//   // their like is inserted into the database. Else, their like is removed.
//   db.execute(
//     'SELECT * FROM likes WHERE postId = ? AND userId = ?',
//     [`${req.body.postId}`, `${req.body.userId}`],
//     (err, results) => {
//       if (results.length == 0) {
//         db.execute(
//           'INSERT INTO likes ( postId, userId ) VALUES ( ?, ?)',
//           [`${req.body.postId}`, `${req.body.userId}`],(err, results) => {

//           },
//         )
//         db.execute(`SELECT * FROM likes`, (err, results) => {
//           res.status(200).json({
//               data: results
//           })
//       })
//       } else if (!results.length == 0) {
//         db.execute(
//           'DELETE FROM likes WHERE ( postId, userId ) = ( ?, ? );', 
//           [`${req.body.postId}`, `${req.body.userId}`], (err, results) => {},
//         )
//         db.execute(`SELECT * FROM likes`, (err, results) => {
//           res.status(200).json({
//               data: results
//           })
//       })
//       }
//     },
//   )
// }