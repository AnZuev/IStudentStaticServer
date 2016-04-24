
var fs = require('fs');
var domain = require('domain');

var httpError = require('../../error').HttpError;


module.exports = function(req, res, next){
	var errHandler = domain.createDomain();
	errHandler.run(function(){

		var fileStream = new fs.ReadStream(req.file.path);
		fileStream.pipe(res);

		fileStream
			.on('error', function(err){
			console.error(err);
			err = new httpError(500, err.toString());
			return next(err);
		});


		res
			.on('close', function(){
			fileStream.destroy();
		});


	});

	errHandler
		.on('error', function(err){
			console.error(err);
			err = new httpError(500, "Серверная ошибка");
			return next(err);
		})
};