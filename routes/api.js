var express = require('express');
var router = express.Router();
var busboy = require('connect-busboy');
var url = require('url');
var fs = require('fs');
var path = require('path');

router.post('/analyze', function(req, res) {
  var fstream;
  debugger;
  if (req.busboy) {
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
      console.log("Uploading: " + filename);
      var filepath = path.resolve('public/uploads/' + filename);
      fs.openSync(filepath, 'w');
      fstream = fs.createWriteStream(filepath);
      file.pipe(fstream);
      fstream.on('close', function () {
        res.json({status: "yep"});
        //res.json({status: "success", name: filename, 'url': url.parse(req.url) + "/uploads/" + filename})
      })
    });
  } else {
    res.json({status: "fail"});
  }
});

module.exports = router;