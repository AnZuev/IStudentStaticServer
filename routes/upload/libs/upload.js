'use strict';

var Fs = require('fs'),
	Crypto = require('crypto');

var config = require(appRoot + '/config');
var tmpFileStorage = config.get('storage:tmpFolder'); //config.storage.tmpFolder;


module.exports = function(file, filename, mimeType){

	try{

		var fileNameArray = filename.split('.');
		var tmpFileName = Crypto.createHmac('sha1', Date.now().toString()).update(filename).update(mimeType).digest("hex") + "." + fileNameArray.pop();
		var tmpName = tmpFileStorage + tmpFileName;
		var fileStream = Fs.createWriteStream(tmpName);
		file.pipe(fileStream);

		return {name: tmpFileName, path: tmpName};
	}catch(e){
		console.log(e);
	}
};