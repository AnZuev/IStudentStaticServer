var uploadFile = require('./../libs/uploadFile');


module.exports = function(req, res, next){

	uploadFile(req, res, "uploadAvatar", {}, 'public', next);
};