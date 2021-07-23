var express = require('express');
var router = express.Router();

router.get('/', function(req, res,) {
  res.json('Hello Walker You shouldn\'t be here');
});

module.exports = router;
