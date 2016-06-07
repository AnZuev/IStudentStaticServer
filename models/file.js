'use strict';
var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema,
	Q = require("q"),
	Util = require('util');

var DbError = require('../error').dbError;


var file = new Schema({
	url: String,
	title: String,
	uploader:{
		type: Schema.Types.ObjectId
	},
    created:{
        type: Date,
        require:true,
        default: Date.now()
    },
	path: String,
	used:{
		type: Boolean,
		default: false
	},
	purpose:{

	},
	access:{
		publicAccess: Boolean,
		"type": String
	}
});



file.statics.add = function(url, publicAccess, accessItem, path, title, uploader){
	var file = new this({
		uploader: uploader,
		publicAccess: publicAccess,
		title: title,
		url: url,
		path: path
	});

	if(!publicAccess) {
		switch (accessItem.type){
			case "conversation":
				file.access.type = "conversation";
				file.access.value = accessItem.convId;
				break;
			case "group":
				file.access.type = 'group';
				break;
			default:
				file.publicAccess = true;
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

file.statics.getFileByUrl = function(url){
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

file.statics.getFileById = function(id){
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



file.methods.formatWithPath = function(){
	return {
		id: this._id,
		uploader: this.uploader,
		path: this.path,
		access: this.access,
		isPublic: this.isPublic
	}
};

file.methods.formatWithoutPath = function(){
	return {
		id: this._id,
		uploader: this.uploader,
		access: this.access,
		isPublic: this.isPublic
	}
};


file.statics.setFileUsedByUrl = function(url, use){
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


module.exports.file = mongoose.model('file', file);



