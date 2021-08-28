const db = require('../database-connection/db')

exports.newsfeed = (req, res, next) => {
  const newsFeed = `SELECT users.userId, users.firstName, users.lastName, posts.textContent, posts.multimediaUrl, posts.timestamp
    FROM posts, users
    WHERE users.userId = posts.userId;`
  db.execute(newsFeed, (err, results) => {
    res.status(200).json({
      data: results,
      message: 'Newsfeed Loaded',
    })
  })
}

exports.createPost = (req, res, next) => {
  db.execute(
    'INSERT INTO posts ( textContent, timestamp, multimediaUrl, userId ) VALUES (?, ?, ?, ?)',
    [
      `${req.body.textContent}`,
      `${req.body.timestamp}`,
      `${req.body.imageUrl}`,
      `${req.body.userId}`,
    ],
    (err) => {
      if (err) {
        res.status(400).json({ message: 'Problem with your post' }),
          console.log(err)
      } else {
        res.status(200).json({
          message: 'Post Successful!',
        })
      }
    },
  )
}
