var uploadFile = require('./../libs/uploadFile');


module.exports = function(req, res, next){
	uploadFile(req, res, "uploadPrivatePhoto", {type: "conversation", convId: req.query.convId}, 'private', next);
};