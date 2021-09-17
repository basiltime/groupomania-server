const db = require('../database-connection/db')

exports.createComment = (req, res, next) => {
    db.execute(
        'INSERT INTO comments ( postId, commenterId, commentText ) VALUES (?, ?, ?)',
        [
          `${req.body.postId}`,
          `${req.body.commenterId}`,
          `${req.body.commentText}`
        ], (err, results) => {
            if (err) {res.status(400).json({message: "error occured"})}
    res.status(200).json({
      data: results,
      message: 'Comment Added',
    })
  })
}

exports.getAllComments = (req, res, next) => {
  db.execute(
      `SELECT *
  FROM comments
  LEFT OUTER JOIN users 
  ON comments.commenterId = users.userId`, (err, comments) => {
          if (err) {res.status(400).json({message: "error occured"})}
  res.status(200).json({
    data: comments,
    message: 'Comments Loaded',
  })
})
}