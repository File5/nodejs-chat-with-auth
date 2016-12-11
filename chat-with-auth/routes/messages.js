var express = require('express');
var router = express.Router();
var Message = require('../models/message');

router.get('/p/:username/:last?/:offset?', function (req, res, next) {
  if (!req.params.offset) {
    req.params.offset = 0;
  }
  if (!req.params.last) {
    req.params.last = 10;
  }
  Message.findAll({
    where: {
      $or: [
        {
          from_id: req.params.username,
          to_id: req.user.username
        },
        {
          from_id: req.user.username,
          to_id: req.params.username
        }
      ]
    },
    order: [
      ['id', 'DESC']
    ],
    limit: +req.params.last,
    offset: +req.params.offset
  }).then(function (msgs) {
    msgs.reverse();
    res.json(msgs);
  });
});

router.get('/chat/:last?/:offset?', function (req, res, next) {
  if (!req.params.offset) {
    req.params.offset = 0;
  }
  if (!req.params.last) {
    req.params.last = 10;
  }
  Message.findAll({
    where: {
      to_id: null
    },
    order: [
      ['id', 'DESC']
    ],
    limit: +req.params.last,
    offset: +req.params.offset
  }).then(function (msgs) {
    msgs.reverse();
    res.json(msgs);
  });
});

module.exports = router;
