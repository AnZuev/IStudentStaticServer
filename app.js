'use strict';

let express = require('express'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	config = require('./config');


let path = require('path'),
	ValidationError = require("@anzuev/studcloud.errors").ValidationError,
	HttpError = require("@anzuev/studcloud.errors").HttpError,
	SSO = require("@anzuev/studcloud.sso");


let app = express();


SSO.init();


app.set('eTag', true);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(SSO.getSessionsMiddleware(config.get('sso:session')));

app.use(SSO.getContextMiddleware());


global.appRoot = path.resolve(__dirname);



app.use('/private/upload', require('./routes/upload'));
require('./routes')(app);





// error handlers



app.use(function(err, req, res, next){
	if(err){
		if(typeof err == "number"){
			err = new HttpError(err, null, err);
		}
		if(err instanceof ValidationError || err instanceof HttpError) {
			res.statusCode = err.code;
			res.send(err.get());
		}else{
			res.writeHead(500);
		}
	}
	res.end();
});

module.exports = app;
