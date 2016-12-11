var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookie = require('cookie');

var session = require('express-session');
var SessionStore = require('express-mysql-session');

var routes = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');
var messages = require('./routes/messages');

var app = express();
var io = require('socket.io')();
app.io = io;

var User = require('./models/user');
var Session = require('./models/session');
var Message = require('./models/message');

//var init = require('./models/init');

io.on('connection', function (socket) {
  var handshake = socket.request;
  var cookies = cookie.parse(handshake.headers.cookie);
  var sid = '';
  if (cookies['session_cookie_name'] !== undefined) {
    sid = cookieParser.signedCookie(cookies['session_cookie_name'], "ILoveJavascript");
  }
  var username = '';
  // console.log(sid);
  // Session.findById(sid).then(function (sessionObj) {
  //   console.log(Session.getUsername(sessionObj));
  // });
  Session.findById(sid).then(function (sessionObj) {
    username = Session.getUsername(sessionObj);
    if (username) {
      User.findOne({
        where: {
          username: username
        }
      }).then(function (user) {
        user.update({
          online: 1
        }).then(function () {});
      });
      socket.broadcast.emit('login', username);
      socket.join(username);
    }
  });
  socket.on('message', function (data) {
    Session.findById(sid).then(function (sessionObj) {
      if (username) {
        data.from_id = username;
        socket.emit('messageSuccess', {});
        var msg = {
          text: data.text,
          from_id: data.from_id
        };
        if (data.to_id) {
          msg.to_id = data.to_id;
        }
        Message.create(msg);
        if (data.to_id) {
          io.to(data.to_id).emit('message', data);
          io.to(data.from_id).emit('message', data);
        } else {
          io.emit('message', data);
        }
      }
    });
  });
  socket.on('disconnect', function (socket) {
    Session.findById(sid).then(function (sessionObj) {
      if (username) {
        User.findOne({
          where: {
            username: username
          }
        }).then(function (user) {
          user.update({
            online: 0
          }).then(function () {});
        });
        io.emit('logout', username);
      }
    });
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'kursk156',
  database: 'test'
};

var sessionStore = new SessionStore(options);

app.use(session({
  key: 'session_cookie_name',
  secret: 'ILoveJavascript',
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}));
//app.use(session({secret: "ILoveJavascript"}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
var User = require('./models/user');
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', routes);
app.use('/', auth);
app.use('/users/', users);
app.use('/messages/', messages);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;