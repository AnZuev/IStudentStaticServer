var path = require('path');
var util = require('util');
var http = require('http');

function HttpError(status, message){
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);

    this.status = status;
    this.message = message || http.STATUS_CODES[status] || "Error";

}

util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';

exports.HttpError = HttpError;

function authError(message, code){
    Error.apply(this, arguments);
    Error.captureStackTrace(this, authError);

    this.message = message;
	this.code = code || 0;

}

util.inherits(authError, Error);
authError.prototype.name = 'authError';

exports.authError = authError;

function dbError(err, code, message){
    Error.apply(this, arguments);
    Error.captureStackTrace(this, dbError);
    this.code = code || 500;
    this.message = message || "Ошибка базы данных";
    this.err = err || null;

}

util.inherits(dbError, Error);
dbError.prototype.name = 'dbError';

exports.dbError = dbError;

function fileValidationError(status, message){
	Error.apply(this, arguments);
	Error.captureStackTrace(this, fileValidationError);

	this.status = status;
	this.message = message || http.STATUS_CODES[status] || "Error";

}

util.inherits(fileValidationError, Error);
fileValidationError.prototype.name = 'fileValidationError';

exports.fileValidationError = fileValidationError;





