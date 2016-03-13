var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;
require('../libs/extensionsForBasicTypes');
var dbError = require('../error').dbError;

var file = new Schema({
	url: String,
	title: String,
	uploader:{
		type: Schema.Types.ObjectId
	},
    created:{
        type: Date,
        require:true,
        default: Date.now()
    },
	access:[Schema.Types.ObjectId],
	path: String,
	publicAccess: Boolean,
	used:{
		typy: Boolean,
		default: false
	}
});



file.statics.addFile = function(url, publicAccess, access, path, title, uploader, callback){
	var file = new this({
		uploader: uploader,
		publicAccess: publicAccess,
		title: title,
		url: url,
		path: path
	});
	if(!publicAccess) {
		access.push(uploader);
		file.access = access.unique();
	}
	addFileTask(file,5, callback);
};


file.statics.getFilePathAndAccessByUrl= function(id, callback){
	this.findById(id, function(err, file){
		if(err) return callback(new dbError(err, 500, "Ошибка во время получения файла из бд"));
		else{
			if(file) return callback(null, {id: id, uploader: file.uploader});
			else return callback(new dbError(err, 404, "Ошибка во время получения файла из бд"));
		}
	})
};

file.statics.getFileByUrl= function(id, callback){
	this.findById(id, function(err, file){
		if(err) return callback(new dbError(err, 500, "Ошибка во время получения файла из бд"));
		else{
			if(file) return callback(null, {id: id, uploader: file.uploader});
			else return callback(new dbError(err, 404, "Ошибка во время получения файла из бд"));
		}
	})
};


module.exports.file = mongoose.model('file', file);


function addFileTask(file, errCounter, callback){
	file.save(function(err, result){
		if(err) {
			if(errCounter > 5) return callback(err);
			addFileTask(file, ++errCounter, callback);
		}
		else{
			return callback(null, result);
		}
	})
}



