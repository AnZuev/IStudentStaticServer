var fileTypesData = require('./fileTypes');

function FileTypesInterface(){
	this.getAllowedFileTypes = function(action){
		var res = [];
		try{
			res = fileTypesData[action].allowTypes
		}catch(e){
			res = [];
		}
		return res;
	};

	this.checkAction = function(action){
		if(fileTypesData[action]) return true;
		else return false;
	};

	this.getPermanentFolder = function(action){
		try{
			return fileTypesData[action].permanentFilesStorage;
		}catch(e){
			return fileTypesData.default.permanentFilesStorage;
		}
	};

	this.getMaxSize = function(action){
		try{
			return (fileTypesData[action].maxSize * 1024 * 1024);
		}catch(e){
			return (fileTypesData.default.maxSize * 1024 * 1024);
		}
	};
	this.getMaxFileCounter = function(action){
		try{
			return fileTypesData[action].maxFilesCounter;
		}catch(e){
			return fileTypesData.default.maxFilesCounter;
		}
	}
}
var FTIItem = new FileTypesInterface();
exports.FTIItem = FTIItem;