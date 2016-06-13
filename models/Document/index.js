'use strict';

let Q = require('q'),
	Util = require('util'),
	DbError = require("@anzuev/studcloud.errors").DbError,
	AuthError = require("@anzuev/studcloud.errors").AuthError,
	Document = require("@anzuev/studcloud.datamodels").Document,
	connection = require(appRoot + '/libs/connections').PSS;

Document.methods.makeZip = require("./handlers/makeZip");


module.exports = connection.model("Document", Document);


