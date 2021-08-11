const createError = require('http-errors')
const express = require('express')
require('dotenv').config()
// Artifts from express application generator
//const cookieParser = require('cookie-parser')
//const logger = require('morgan')



const postsRouter = require('./routes/posts')
const usersRouter = require('./routes/users')

const app = express()



// Artifacts from express application generator
//app.use(logger('dev'))
//app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/posts', postsRouter)
app.use('/users', usersRouter)


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

});

module.exports = app;
