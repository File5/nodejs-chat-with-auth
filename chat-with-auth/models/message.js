var Sequelize = require('sequelize');
var config = require('../config');
var db = new Sequelize(config.toString());

var Message = db.define('Message', {
  from_id: Sequelize.STRING,
  to_id: {
    type: Sequelize.STRING,
    allowNull: true
  },
  text: Sequelize.TEXT
});

module.exports = Message;