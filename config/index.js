/**
 * Created by anton on 17/02/15.
 */
var nconf = require('nconf');
var path = require('path');


nconf.argv()
    .env()
    .add("PSSConfig", {type: 'file', file: path.join(__dirname, 'config.json')});

module.exports = nconf;
