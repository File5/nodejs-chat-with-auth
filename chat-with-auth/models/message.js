var Sequelize = require('sequelize');
var db = new Sequelize('mysql://root:kursk156@localhost:3306/test');

var Message = db.define('Message', {
  from_id: Sequelize.STRING,
  to_id: {
    type: Sequelize.STRING,
    allowNull: true
  },
  text: Sequelize.TEXT
});
//Message.sync({force: true});

module.exports = Message;