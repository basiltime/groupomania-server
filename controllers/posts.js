const db = require('../database-connection/db')

exports.newsfeed =  (req, res, next) => {
    const newsFeed = `SELECT users.userId, users.firstName, users.lastName, posts.textContent, posts.multimediaUrl, posts.timestamp
    FROM posts, users
    WHERE users.userId = posts.userId;`
    db.query(newsFeed, (err, results) => {
      res.status(200).json({
      data: results
      })
    })

console.log('Access to Posts Allowed')
}



exports.createPost = (req, res, next) => {

  const postData = `INSERT INTO posts
  ( 
    textContent,
    timestamp,
    multimediaUrl,
    userId ) 
VALUES ( "${req.body.textContent}",
      "${req.body.timestamp}", 
      "${req.body.imageUrl}", 
      "${req.body.userId}")`

db.query(postData, (err) => {
if (err) { res.status(400).json({message: 'Problem with your post'}), console.log(err) } 
else {
console.log('Post Created!')
  res.status(200).json({
  message: "you sent back data!"
  })
}
})
}


