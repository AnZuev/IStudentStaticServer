var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('./config');
var path = require('path');
var fileValidationError = require('./error').fileValidationError;


var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());


var session = require('express-session');
app.use(session({
	secret: config.get('session:secret'),
	key: config.get('session:key'),
	cookie: config.get('session:cookie'),
	resave: false,
	saveUninitialized: true,
	store: require('./libs/sessionsStore')
}));

global.appRoot = path.resolve(__dirname);

app.use(require('./middleware/sendHttpError'));

app.use('/private/upload', require('./routes/upload'));
require('./routes')(app);





// error handlers



app.use(function(err, req, res, next){
	if(err){
		console.error(err);
		if(typeof err == "number"){
			res.writeHead(err);
		}else if(err instanceof fileValidationError) {
			res.sendHttpError(err);
		}else{
			res.writeHead(500);
		}
	}
	res.end();
});

module.exports = app;
