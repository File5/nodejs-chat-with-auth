var config = {
  protocol: 'mysql',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'kursk156',
  database: 'test'
};

config.toString = function () {
  return this.protocol + '://' + this.user + ':' + this.password + '@' + this.host + ":" + this.port + '/' + this.database;
};

module.exports = config;
