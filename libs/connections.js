'use strict';

let mongoose = require('mongoose');

mongoose.Promise = require('q').Promise;

var config = require('nconf');
let usersCon,
	PSSCon;

if(config.get("mongoose:PSSUri")){
	PSSCon = mongoose.createConnection(config.get('mongoose:PSSUri'), config.get('mongoose:PSSOptions'));
}else{
	throw new Error("Can't connect to sso collection. No mongoose:PSSUri property specified");
}
module.exports.PSS = PSSCon;


if(config.get("mongoose:UsersUri")){
	usersCon = mongoose.createConnection(config.get('mongoose:UsersUri'), config.get('mongoose:UsersOptions'));
}else{
	throw new Error("Can't connect to users collection. No mongoose:UsersUri property specified");
}
module.exports.users = usersCon;