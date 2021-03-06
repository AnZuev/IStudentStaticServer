'use strict';

var ValidationError = require("@anzuev/studcloud.errors").ValidationError;
var FileRules = require(appRoot + '/config/fileConfig/fileTypesInterface').FileRules;

module.exports = function(action, fileName, size){
	let error;

	let fileNameValidationResult = (fileName.length > 5);
	let sizeValidationResult = FileRules.validateSize(action, size);
	let typeValidationResult = FileRules.validateType(action, fileName);
	if(!fileNameValidationResult){
		error = new ValidationError(400, "File hasn't been sent");
	}else if(!sizeValidationResult){
		error = new ValidationError(400, "File is too large");
	}else if(!typeValidationResult){
		error = new ValidationError(400, "File type is forbidden");
	}
	if(error) return {exception: true, err: error};
	else return {exception: false};

};