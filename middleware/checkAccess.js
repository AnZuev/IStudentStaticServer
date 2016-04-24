var async = require('async');
var domain = require('domain');

var file = require('../models/file').file;
var httpError = require('../error').HttpError;


module.exports = function(req, res, next){
	var errHandler = domain.createDomain();
	errHandler.run(function(){
		var query = req.query.url || "";
		async.waterfall([
			function(callback){
				file.getFilePathAndAccessByUrl(query, callback);
			},
			function(file, callback){
				if(!file) return callback(null, false);
				if(file.isPublic){
					req.file = {};
					req.file.path = file.path;
					return callback(null, true)
				}else if(file.access.indexOf(req.session.user) >= 0){
					req.file = {};
					req.file.path = file.path;
					return callback(null, true)
				}else{
					return callback(null, false);
				}
			}
		],function (err, result){
			if(err || !result){
				err = new httpError(403, "Доступ запрещен");
				return next(err);
			}else{
				return next();
			}
		})
	});
	errHandler.on("error", function(){
		var err = new httpError(500, "Необработанная ошибка сервера");
		return next(err);
	})
}