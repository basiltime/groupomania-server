const createError = require('http-errors')
const express = require('express')
require('dotenv').config()
// Artifcats from express application generator
//const cookieParser = require('cookie-parser')
//const logger = require('morgan')
const mysql = require('mysql2')

const testAPIRouter = require('./routes/comments')
const indexRouter = require('./routes/posts')
const usersRouter = require('./routes/users')

const app = express()



// Artifacts from express application generator
//app.use(logger('dev'))
//app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// Create Connection
const db = mysql.createConnection({
  host      : process.env.DB_HOST,
  user      : process.env.DB_USER,
  password  : process.env.DB_PASS,
  database  : 'groupomania'
})

// Connect
db.connect((err) => {
  if(err) {
    throw err;
  }
  console.log('MySQL Connected')
})

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/testAPI', testAPIRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
