var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get('/login', function (req, res, next) {
  var error = '';
  if (req.query.e) {
    error = req.query.e;
  }
  res.render('login', {
    title: 'Login',
    error: error
  });
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login?e=1'
}), function (req, res, next) {
  res.redirect('/');
});

router.all('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/login');
});

router.get('/register', function (req, res, next) {
  var error = '';
  if (req.query.e) {
    error = req.query.e;
  }
  res.render('registration', {
    title: 'Registration',
    error: error
  });
});

router.post('/register', function (req, res, next) {
  var username = req.body.username;
  User.findOne({
    where: {
      username: username
    }
  }).then(function (user) {
    if (user !== null) {
      res.redirect('/register?e=2');
      console.log(user);
      return;
    }
  });
  if (req.body.password != req.body.password2) {
    res.redirect('/register?e=1');
    return;
  }
  User.register(req.body.username, req.body.password, function (err, user) {
    if (err === null) {
      next();
    } else {
      console.log(err);
    }
  });
}, passport.authenticate('local', {
  failureRedirect: '/login?e=1',
  successRedirect: '/'
}));

router.get('/username', function (req, res, next) {
  res.json(req.user.username);
})

module.exports = router;