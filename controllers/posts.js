const db = require('../database-connection/db')


 

exports.newsfeed = (req, res, next) => {
  const newsFeed = `SELECT *
  FROM posts
  LEFT OUTER JOIN users 
  ON posts.userId = users.userId;`
  db.query(newsFeed, (err, results) => {
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
      `${req.file.location}`,
      `${req.body.userId}`
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