var config = require('../config');
var path = require('path');

var crypto = require('crypto');
var fs = require('fs');

var checkAuth = require('../middleware/checkAuth');
//var checkAccess = require('../middleware/checkAccess');

module.exports = function(app){

	app.all('*', checkAuth, function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	});


    app.get('/files/:id', checkAuth, /*checkAccess*/ require('./handlers/sendFile'));


	//app.post("/uploadDocument", require('./handlers/uploadFile'));

	app.get('/private/uploadForm', function(req, res, next){
		res.sendFile(path.join(__dirname, "../index.html"));
	})


};