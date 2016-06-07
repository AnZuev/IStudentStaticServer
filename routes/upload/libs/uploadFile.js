'use strict';

var config = require(appRoot + '/config/index'),
	Q = require("q"),
	path = require('path'),
	Busboy = require('busboy'),
	domain = require('domain');



var User = require(appRoot + '/models/User').User,
	log = require(appRoot + '/libs/log');

var validateFile = require("./validateFile");
var uploadFileToTempDirectory = require('./upload');
var addFileToDbAndRename = require('./saveFile');


var fileValidationError = require(appRoot + '/error/index').fileValidationError;

var FileRules = require(appRoot + '/config/fileConfig/fileTypesInterface').FileRules;




module.exports = function(req, res, action, accessItem, accessType, next){

	var errHandler = domain.create();
	errHandler.run(function(){
		executor(req, res, action, accessItem, accessType, next);
	});

	errHandler.on('error', function(err){
		console.error(err);
		return next(new fileValidationError(500, "Произошла ошибка файловой системы. Ошибка доступа"));
	})

};

function executor (req, res, action, accessItem, accessType, next) {
	let busboy = new Busboy({headers: req.headers});

	busboy.on('file', function (fieldName, file, fileName, encoding, mimeType) {
		let tmpFile;

		var validationErr = validateFile(action, fileName, req.headers['content-length']);
		if (validationErr.exception) {
			return next(validationErr.err);
		} else {
			tmpFile = uploadFileToTempDirectory(file, fileName, mimeType);
		}
		file.on("end", function(){
			Q.async(function*(){
				let result;

				if(accessType == 'public'){
					result = yield* step3.publicAccess(tmpFile, fileName, action, req.session.user);
				}else if(accessType == 'private'){
					result = yield* step3.noPublicAccess(tmpFile, fileName, action, req.session.user, accessItem);
				}

				console.log(result);
				res.json({result: true, id: result._id});


			})().done();
		});
	});
	req.pipe(busboy);
}


let step3 = {
	publicAccess: publicAccess,
	noPublicAccess: noPublicAccess
};

function* publicAccess(tmpFile, fileName, action, userId) {
	var permanentFileName = FileRules.getPermanentFolder(action) + Date.now() + tmpFile.name;

	var url = permanentFileName.split('/');
	url.splice(0, 4);
	url = url.join("/");

	var options = {
		url: url,
		publicAccess: true,
		path: permanentFileName,
		title: fileName,
		uploader: userId,
		tmpPath: tmpFile.path,
		permanentPath: permanentFileName
	};
	return yield addFileToDbAndRename(options);
}

function* noPublicAccess(tmpFile, fileName, action, userId, accessItem) {
	var permanentFileName = FileRules.getPermanentFolder(action) + Date.now() + tmpFile.name;

	var url = permanentFileName.split('/');
	url.splice(0, 4);
	url = url.join("/");

	var options = {
		url: url,
		publicAccess: false,
		path: permanentFileName,
		title: fileName,
		uploader: userId,
		tmpPath: tmpFile.path,
		permanentPath: permanentFileName,
		accessItem: accessItem
	};
	return yield addFileToDbAndRename(options);
}