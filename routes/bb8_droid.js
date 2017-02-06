var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('bb8_droid', { title: 'Zeb-bb8_droid' });
});

module.exports = router;
