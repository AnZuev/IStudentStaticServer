'use strict';

let Fs = require('fs'),
	Q = require('q');
let Files = require(appRoot + '/models/file').file;



function handler (options){
	let defer = Q.defer();

	Q.async(function*(){
		try{
			yield fsRenamePromise(options);
			let result = yield* saveFileGenerator(options);
			defer.resolve(result);
		}catch(err){
			defer.reject(err);
		}
	})();
	return defer.promise;
}

let fsRenamePromise = function (options){
	let defer = Q.defer();
	Fs.rename(options.tmpPath, options.permanentPath, function(err){
		if(err) defer.reject(err);
		else defer.resolve({a:5});
	});
	return defer.promise;

};

function* saveFileGenerator(options){
	let a = 5;
	let result;
	while(a > 0){
		try{
			result = yield Files.add(options.url,
				options.publicAccess,
				options.accessItem,
				options.permanentPath,
				options.title,
				options.uploader);
			break;
		}catch(err){
			a--;
		}
	}
	return result;
}


module.exports = handler;
