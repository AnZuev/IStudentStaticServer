'use strict';
let JSZip = require('jszip'),
	Fs = require('fs'),
	File = require('../../File'),
	Q = require("q"),
	HttpError = require('@anzuev/studcloud.errors').HttpError;

const zlib = require('zlib');


function* makeZip(document){

	let zip = new JSZip();
	if(document.parts.length == 0) throw new HttpError(404, 'No parts found', 404);
	for(let i = 0; i < document.parts.length; i++){
		try{
			var part = document.parts[i].toObject();
			let file = yield File.getFileById(part.url);
			let stream = Fs.createReadStream(file.path);
			zip.file(file.title, stream);
		}catch(err){
			console.error(err);
		}
	}
	return zip;
}


module.exports = function(){
	return Q.async(makeZip)(this);
};