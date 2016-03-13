module.exports = function(req, res, next){

	res.sendHttpError = function(error){
		res.setHeader("Connection", "Close");
		if(res.req.headers['x-requested-with'] === 'XMLHttpRequest'){
			res.statusCode = error.status || 500;
			res.json({exception: true, message: error.message, code: error.status || 500});
		}else{
			// отдать страницу с ошибкой
			res.statusCode = error.status || 500;
			res.json({exception: true, message: error.message, code: error.status || 500});
		}
		res.end();
	};
	next();
};