var Sequelize = require('sequelize');
var config = require('../config');
var db = new Sequelize(config.toString());
var passportHelper = require('passport-local-sequelize');

var User = passportHelper.defineUser(db, {
  online: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0
  }
});

module.exports = User;