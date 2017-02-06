var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('r2d2', { title: 'r2d2' });
});

module.exports = router;
