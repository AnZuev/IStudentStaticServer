'use strict';

var fs = require('fs');

var HttpError = require('@anzuev/studcloud.errors').HttpError;
let File = require(appRoot + '/models/File'),
	mongoose = require("mongoose"),
	Q = require('q'),
	eTag = require('etag');
let SSO = require("@anzuev/studcloud.sso");



module.exports = function(req, res, next) {

	Q.async(function*() {
		
		let file;
		try {
			let id = mongoose.Types.ObjectId(req.params.id);
			file = yield File.getFileById(id);
			if(!(yield SSO.checkPermissionToGetFile(req.user, req.params.id))) return next(404);
		} catch (err) {
			console.error(err);
			return next(404);
		}
		let newEtag = eTag(file.path);
		if(newEtag == req.headers['if-none-match']){
			res.statusCode = 304;
			res.end();
		}else{
			var fileStream = new fs.ReadStream(file.path);
			res.setHeader('ETag', newEtag);
			fileStream.pipe(res);

			fileStream
				.on('error', function (err) {
					console.log(err);
					return next(new HttpError(404, "File not found", 404));
				});

			res
				.on('close', function () {
					fileStream.destroy();
				});
		}



	})().done();
};