var Message = require('./message');
var User = require('./user');

Message.sync({force: true});
User.sync({force: true});
