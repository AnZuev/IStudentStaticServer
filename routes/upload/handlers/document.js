var uploadFile = require('./../libs/uploadFile');


module.exports = function(req, res, next){
	uploadFile(req, res, "uploadDocumentsToBZ", {}, "public", next);
};