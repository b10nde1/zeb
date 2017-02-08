var express = require('express');
var router = express.Router();
var diffjs=require('diff');

router.get('/', function(req, res, next) {  
  res.render('bb8_droid', { title: 'Zeb-bb8_droid' });
});

router.post('/',function(req,res){
  var textarea1=req.body.textarea1, textarea2=req.body.textarea2, diff = diffjs.diffChars(textarea1, textarea2),result="Les texts correspondent",indice='color:green';
  diff.forEach(function(part){
    if(part.added || part.removed)result="Des erreurs entre les texts",indice='color:red';
  });
  res.render('bb8_droid',{
    title:'Zeb-bb8_droid',
    textValueToUp: result,
    indiceColor : indice,
    textarea1Up : textarea1,
    textarea2Up : textarea2
  });
});

module.exports = router;
