
var fileValidationError = require('../../error/index').fileValidationError;
var FTIItem = require('../../config/fileConfig/fileTypesInterface').FTIItem;
var maxSize;
var allowedFiles;

module.exports = function(action, mimeType, req){
	maxSize = FTIItem.getMaxSize(action);
	allowedFiles = FTIItem.getAllowedFileTypes(action);
	var error;
	if(req.headers["content-length"] > maxSize) {
		error = new fileValidationError(400, "Файл слишком большой");
	}else if(allowedFiles.indexOf(mimeType) < 0){
		error = new fileValidationError(400, "Недопустимый тип файла");
	}
	if(error) return {exception: true, err: error};
	else return {exception: false};
};