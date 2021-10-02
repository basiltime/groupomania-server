const createError = require('http-errors')
const express = require('express')
require('dotenv').config()
const postsRouter = require('./routes/posts')
const usersRouter = require('./routes/users')
const commentsRouter = require('./routes/comments')
const likesRouter = require('./routes/likes')
const homeRouter = require('./routes/home')
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/likes', likesRouter)
app.use('/', homeRouter)
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