'use strict';


var fileTypesData = require('./fileTypes'); // TODO: заменить на fileTypes при установке на тестовый сервер
function FileRules(){

}

FileRules.prototype.validateType = function(action, fileName){
	let types;
	let fileType = fileName.split('.');
	fileType = fileType[fileType.length -1];

	if(fileTypesData[action].types){
		types = fileTypesData[action].types;
		return (types.indexOf(fileType) >= 0);

	}else{
		types = fileTypesData[action].forbiddenTypes;
		return (types.indexOf(fileType) < 0);
	}
};

FileRules.prototype.validateSize = function(action, size){
	let allowedSize = fileTypesData[action].maxSize * 1024 * 1024;
	return (allowedSize >= size);
};


FileRules.prototype.getPermanentFolder = function(action){
	try{
		return fileTypesData[action].permanentFilesStorage;
	}catch(e){
		return fileTypesData.default.permanentFilesStorage;
	}
};

var fileRules = new FileRules();
exports.FileRules = fileRules;