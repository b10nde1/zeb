var express = require('express');
var router = express.Router();

/*require('colors');
var jsdiff = require('/usr/local/lib/node_modules/diff');

var one = 'beep boop';
var other = 'beep boob blah';
var diff = jsdiff.diffChars(one, other);
diff.forEach(function(part){
  // green for additions, red for deletions
  // grey for common parts
  var color = part.added ? 'green' :
    part.removed ? 'red' : 'grey';
    //process.stderr.write(part.value[color]);
});*/

/* GET home page. */
router.get('/', function(req, res, next) {  
  res.render('bb8_droid', { title: 'Zeb-bb8_droid' });
});
router.post('/',function(req,res){
  console.log("salut");
});

module.exports = router;
