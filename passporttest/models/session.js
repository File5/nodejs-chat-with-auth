var Sequelize = require('sequelize');
var db = new Sequelize('mysql://root:kursk156@localhost:3306/test');

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
//User.sync({force: true});
//User.register("login", "password", function (err) {
//  console.log(JSON.stringify(err));
//});
Session.getUsername = function (obj) {
  return JSON.parse(obj.dataValues.data).passport.user;
};

module.exports = Session;