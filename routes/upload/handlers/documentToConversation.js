var uploadFile = require('./../libs/uploadFile');


module.exports = function(req, res, next){
	uploadFile(req, res, "uploadPrivateDocument", next);
};