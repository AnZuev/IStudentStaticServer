var config = require('../config');
var path = require('path');

var crypto = require('crypto');
var fs = require('fs');

var checkAuth = require('../middleware/checkAuth');
//var publicKey= fs.readFileSync(path.join(__dirname , "../" ,config.get("publicKey")).toString('ascii'));
//var privateKey= fs.readFileSync(path.join(__dirname , "../" ,config.get("privateKey")).toString('ascii'));


module.exports = function(app){

	app.all('*', checkAuth, function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	});


    //app.get('/file/:id', require(''));

	app.post("/private/uploadAvatar", require('./handlers/uploadAvatar'));

	//app.post("/uploadPrivatePhoto", require('./uploadPrivatePhoto'));

	//app.post("/uploadPrivateDocument", require('./uploadPrivateDocument'));

	//app.post("/uploadDocument", require('./handlers/uploadFile'));


	app.get('/private/uploadForm', function(req, res, next){
		res.sendFile(path.join(__dirname, "../index.html"));
	})




}