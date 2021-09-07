const db = require('../database-connection/db')


 

exports.newsfeed = (req, res, next) => {
  db.execute(`SELECT *
  FROM posts
  LEFT OUTER JOIN users 
  ON posts.userId = users.userId`, (err, results) => {
    res.status(200).json({
      data: results,
      message: 'Newsfeed Loaded',
    })
  })
}





exports.createPost = (req, res, next) => {
  // Check if there is a file before submitting values to database. If not, set the multimediaUrl as null.
  let image = ""
  if (req.file) {image = req.file.location}
  else {image = null}
  db.execute(
    'INSERT INTO posts ( textContent, timestamp, multimediaUrl, userId ) VALUES (?, ?, ?, ?)',
    [
      `${req.body.textContent}`,
      `${req.body.timestamp}`,
      `${image}`,
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