module.exports = function(req, res, next){
	if(!req.session.user) return next(401);
	else return next();
}