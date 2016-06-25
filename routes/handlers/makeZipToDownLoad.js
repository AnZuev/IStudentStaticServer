'use strict';

let Document = require("../../models/Document"),
	Mongoose = require("mongoose"),
	Q = require('q'),
	Util = require('util');

let File = require('../../models/File');

module.exports = function(req, res, next){
	Q.async(handler)(req, res, next).done();
};


function* handler(req, res, next){
	try{
		let id = Mongoose.Types.ObjectId(req.params.id);
		let document = yield Document.getDocumentById(id);

		let zip = yield document.makeZip();

		let out = zip.generateNodeStream({type:'nodebuffer',streamFiles:true});
		out
			.pipe(res)
			.on('finish', function () {
				res.end();
				console.log("File has been sent.");
			});
		res
			.on('close', function(){
				out.destroy();
			});
		res.writeHead(200, {
			'Content-Type': 'application/zip;',
			'Content-Disposition': "attachment;"
		});

	}catch(err){
		return next(404);
	}

}