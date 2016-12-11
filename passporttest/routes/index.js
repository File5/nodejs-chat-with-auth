var express = require('express');
var router = express.Router();
var authorized = require('../middleware/authorized');

/* GET home page. */
router.get('/', authorized, function (req, res, next) {
  console.log("GET /");
  var username = req.user.username;
  res.render('index', {
    title: 'Chat',
    username: username
  });
});

module.exports = router;