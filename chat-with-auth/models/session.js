var Sequelize = require('sequelize');
var config = require('../config');
var db = new Sequelize(config.toString());

var Session = db.define('session', {
  id: {
    field: "session_id",
    type: Sequelize.STRING,
    primaryKey: true
  },
  expires: Sequelize.BIGINT(11),
  data: Sequelize.TEXT
}, {
  timestamps: false
});
Session.getUsername = function (obj) {
  return JSON.parse(obj.dataValues.data).passport.user;
};

module.exports = Session;