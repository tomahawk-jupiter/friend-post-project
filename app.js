require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require("helmet");
const flash = require('connect-flash');

const profileRouter = require('./routes/profile');
const authRouter = require('./routes/auth');
const signupRouter = require('./routes/signup')
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');
const friendsRouter = require('./routes/friends');


const mongoose = require('mongoose');
const testDatabase = process.env.TESTDB_MONGO_URI;
mongoose.connect(testDatabase, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) { console.log(err); }
  if (!err) { console.log('>> Mongoose connected <<'); }
});

// mongoose.connection.close(function () {
//   console.log('Mongoose default connection closed');
// });

const app = express();

/// Helmet helps you secure your Express apps by setting various HTTP headers. ///
app.use(helmet());

// For flash messages when passport auth fails.
app.use(flash());

/// Passport setup ///
const passport = require('./authentication/githubAuth');
const passport2 = require('./authentication/localAuth')

/// session middleware ///
const session = require('express-session')

/* 
**SESSION SETUP**
httpOnly: cookie stored in server and not in browser. 
secure: false, if set to true it needs to be https for which you need
an SSL certificate
maxAge: is how long the session lasts for in miliseconds.
*/
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 1000
  }
}))

/// Middleware for passport
app.use(passport.initialize());
app.use(passport2.initialize());

// Create a passport session.
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', profileRouter);
app.use('/', authRouter);
app.use('/', postRouter);
app.use('/', commentRouter);
app.use('/', signupRouter);
app.use('/', friendsRouter);

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
