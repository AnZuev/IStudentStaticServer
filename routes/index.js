var config = require('../config');
var path = require('path');

var crypto = require('crypto');
var fs = require('fs');

var checkAuth = require('../middleware/checkAuth');
var checkAccess = require('../middleware/checkAccess');
//var publicKey= fs.readFileSync(path.join(__dirname , "../" ,config.get("publicKey")).toString('ascii'));
//var privateKey= fs.readFileSync(path.join(__dirname , "../" ,config.get("privateKey")).toString('ascii'));


module.exports = function(app){

	app.all('*', checkAuth, function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	});


    app.get('/files/', checkAuth, checkAccess, require('./handlers/sendFile'));

	app.post("/private/uploadAvatar", checkAuth, require('./handlers/uploadAvatar'));

	app.post("/private/uploadPrivatePhoto", checkAuth, require('./handlers/uploadPrivatePhoto'));

	app.post("/private/uploadPrivateDocument", checkAuth, require('./handlers/uploadPrivateDocument'));

	//app.post("/uploadDocument", require('./handlers/uploadFile'));

	app.get('/private/uploadForm', function(req, res, next){
		res.sendFile(path.join(__dirname, "../index.html"));
	})


}