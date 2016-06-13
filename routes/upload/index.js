'use strict';

let express = require('express'),
	router = express.Router();




router.post("/avatar", require('./handlers/avatar'));
router.post("/photo", require('./handlers/photo'));
router.post("/document", require('./handlers/document'));

module.exports = router;