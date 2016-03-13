var config = require('../../config/index');
var path = require('path');

var Busboy = require('busboy');
var async = require('async');
var domain = require('domain');


var User = require('../../models/User').User;
var validateFileBeforeUpload = require("../libs/validateFileBeforeUpload");
var uploadFileToTempDirectory = require('../libs/uploadFileToTemporaryDirectory');
var fileValidationError = require('../../error/index').fileValidationError;

var FTIItem = require('../../config/fileConfig/fileTypesInterface').FTIItem;


var addFileToDbAndRename = require('../libs/addFileToDbAndRename.js');


module.exports = function(req, res, action, next){

	var errHandler = domain.create();
	errHandler.run(function() {
		var busboy = new Busboy({headers: req.headers});

		busboy.on('file', function (fieldName, file, fileName, encoding, mimeType) {
			var tmpFile;
			if (fileName.length < 5) return next(new fileValidationError(400, "Файл не был передан"));
			var validationErr = validateFileBeforeUpload(action, mimeType, req);
			if (validationErr.exception) {
				return next(validationErr.err);
			} else {
				tmpFile = uploadFileToTempDirectory(file, fileName, mimeType);
			}

			file.on("end", function () {
				var permanentFileName = FTIItem.getPermanentFolder(action) + Date.now() + tmpFile.name;

				var url = permanentFileName.split('/');
				url.splice(0, 4);
				url = url.join("/");
				var options = {
					url: url,
					publicAccess: true,
					access: [],
					path: permanentFileName,
					title: fileName,
					uploader: req.session.user,
					tmpPath: tmpFile.path,
					permanentPath: permanentFileName
				};
				addFileToDbAndRename(options, function (err) {
					if (err) {
						var error = new fileValidationError(500, "Серверная ошибка");
						return next(error);
					}
					res.json({url: url, result: "done"});
					next();
				});
			})

		});
		req.pipe(busboy);
	});

	errHandler.on('error', function(err){
		return next(new fileValidationError(500, "Произошла ошибка файловой системы. Ошибка доступа"));
	})

};