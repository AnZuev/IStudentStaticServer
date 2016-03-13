var fs = require('fs');
var files = require('../../models/file').file;
var async = require('async');
module.exports = function(options, callback){
	async.waterfall([
			function(callback){
				fs.rename(options.tmpPath, options.permanentPath, callback);
			},
			function(callback){
				files.addFile(options.url, options.publicAccess, options.access, options.permanentPath, options.title, options.uploader, callback);
			}
		], callback);
};