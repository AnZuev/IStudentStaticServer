var session = require('express-session');
var config = require('../config');


var MongoStore = require('connect-mongo/es5')(session);

var sessionStore = new MongoStore({url: config.get("mongoose:uri")});

module.exports = sessionStore;