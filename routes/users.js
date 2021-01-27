var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res, next) {
  app.setHeader('Access-Control-Allow-Origin', '*');
  res.send('respond with a resource');
});

module.exports = router;
