const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization
    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
      if (err) {
        return res.status(403).send('User not authorized to access this resource')
      }
      req.userId = user.userId

      next()
    })
  } catch (error) {
    res.status(400).send('Invalid token')
  }
}