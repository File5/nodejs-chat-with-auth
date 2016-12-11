var Sequelize = require('sequelize');
var db = new Sequelize('mysql://root:kursk156@localhost:3306/test');
var passportHelper = require('passport-local-sequelize');

var User = passportHelper.defineUser(db, {
  online: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0
  }
});
//User.sync({force: true});
//User.register("login", "password", function (err) {
//  console.log(JSON.stringify(err));
//});

module.exports = User;