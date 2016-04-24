var uploadFile = require('./uploadFile');


module.exports = function(req, res, next){
	uploadFile(req, res, "uploadPrivateDocument", next);
};