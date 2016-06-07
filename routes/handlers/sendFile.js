'use strict';

var fs = require('fs');
var domain = require('domain');

var httpError = require('../../error').HttpError;
let File = require(appRoot + '/models/file').file;

let Q = require('q');
module.exports = function(req, res, next){
	Q.async(function*(){
		let file;
		try{
			file = yield File.getFileById(req.params.id);
		}catch (err){
			return next(404);
		}

		var fileStream = new fs.ReadStream(file.path);
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

	})().done();
	/*var errHandler = domain.createDomain();
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
		})*/
};