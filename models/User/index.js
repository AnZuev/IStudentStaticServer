'use strict';

let Q = require('q'),
	Util = require('util'),
	DbError = require("@anzuev/studcloud.errors").DbError,
	AuthError = require("@anzuev/studcloud.errors").AuthError,
	Crypto = require('crypto'),
	User = require("@anzuev/studcloud.datamodels").User,
	connection = require(appRoot + '/libs/connections').users;


User.statics.getById = function(id){
	let defer = Q.defer();
	let promise = this.findById(id);
	promise.then(function(user){
		if(!user) return defer.reject(new DbError(null, 404, Util.format("No user found by %s", id)));
		else{
			return defer.fulfill(user);
		}
	}).catch(function(err){
		defer.reject(new DbError(err, 500));
	});
	return defer.promise;
};


module.exports = connection.model("User", User);


