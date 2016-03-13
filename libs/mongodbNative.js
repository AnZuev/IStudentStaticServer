var mongoose = require('./mongoose');
var config = require('../config');
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

exports.dropCollection = function(collectionName, callback){
    MongoClient.connect(config.get('mongoose:uri'), function(err, db) {
        assert.equal(null, err);
        db.collection(collectionName).drop(function(err, results){
            db.close();
            return callback(null, true);
        })
    });
}
