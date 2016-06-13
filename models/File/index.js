'use strict';

let Q = require('q'),
	Util = require('util'),
	DbError = require("@anzuev/studcloud.errors").DbError,
	AuthError = require("@anzuev/studcloud.errors").AuthError,
	File = require("@anzuev/studcloud.datamodels").File,
	connection = require(appRoot + '/libs/connections').PSS;


File.statics.add = function(url, publicAccess, accessItem, path, title, uploader){
	var file = new this({
		uploader: uploader,
		access: {
			publicAccess: publicAccess
		},
		title: title,
		url: url,
		path: path
	});

	if(!publicAccess) {
		switch (accessItem.type){
			case "conversation":
				file.access.cType = "conversation";
				file.access.value = accessItem.convId;
				break;
			case "group":
				file.access.cType = 'group';
				break;
			default:
				file.access.publicAccess = true;
		}
	}
	let defer = Q.defer();

	file
		.save()
		.then(function(file){
			defer.resolve(file);
		}).catch(function(err){
		defer.reject(new DbError(err, 500, Util.format("Can't save file")));
	});
	return defer.promise;

};

File.statics.getFileByUrl = function(url){
	let defer = Q.defer();
	var promise = this.find(
		{
			url: url
		}
	).exec();

	promise.then(function(file){
		if(file) defer.fulfill(file);
		else {
			throw new DbError(err, 404, Util.format('No file found by url %s', url));
		}
	}).catch(function(err){
		if(err) defer.reject(new DbError(err, 500));
	});

	return defer.promise;
};

File.statics.getFileById = function(id){
	let deffer = Q.defer();
	var promise = this.findById(id).exec();
	promise.then(function(file){
		if(file) deffer.fulfill(file);
		else {
			throw new DbError(null, 404, Util.format('No file found by id %s', id));
		}
	}).catch(function(err){
		console.log(err);
		if(err) deffer.reject(new DbError(err, 500));
	});

	return deffer.promise;
};



File.methods.formatWithPath = function(){
	return {
		id: this._id,
		uploader: this.uploader,
		path: this.path,
		access: this.access
	}
};

File.methods.formatWithoutPath = function(){
	return {
		id: this._id,
		uploader: this.uploader,
		access: this.access
	}
};

File.statics.setFileUsedByUrl = function(url, use){
	let defer = Q.defer();

	this.getFileByUrl(url)
		.then(function(file){
			file.used = use;
			return file.save();
		})
		.then(function(file){
			return defer.fulfill(file);
		})
		.catch(function(err){
			if(err instanceof DbError){
				defer.reject(err);
			}else{
				defer.reject(new DbError(err, 500));
			}
		})
};


module.exports = connection.model("File", File);


