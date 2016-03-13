var config = require('../../config');

var tmpFileStorage = config.get('storage:tmpFolder'); //config.storage.tmpFolder;
var fs = require('fs');
var crypto = require('crypto');
var domain = require('domain');

module.exports = function(file, filename, mimeType){

	var fileNameArray = filename.split('.');
	var tmpFileName = crypto.createHmac('sha1', Date.now().toString()).update(filename).update(mimeType).digest("hex") + "." + fileNameArray.pop();
	var tmpName = tmpFileStorage + tmpFileName;
	var fileStream = fs.createWriteStream(tmpName);
	file.pipe(fileStream);
	return {name: tmpFileName, path: tmpName};
};