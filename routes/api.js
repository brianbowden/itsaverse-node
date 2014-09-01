var express = require('express');
var router = express.Router();
var busboy = require('connect-busboy');
var url = require('url');
var fs = require('fs');
var path = require('path');
var tess = require('node-tesseract');

var filepath;

router.post('/analyze', function(req, res) {
  var fstream;
  debugger;
  if (req.busboy) {
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
      console.log("Uploading: " + filename);
      filepath = path.resolve('public/uploads/' + filename);
      fs.openSync(filepath, 'w');
      fstream = fs.createWriteStream(filepath);
      file.pipe(fstream);
      fstream.on('close', function () {
        if (!filepath) return;

        tess.process(filepath, function(err, text) {
          fs.unlink(filepath, function(err) {
            if (err) {
              console.error(err);
            }
          });

          if (err) {
            console.error(err);
            res.json({status: "nope", 'error': error});

          } else {
            res.json({status: "yep", 'image_text': text});
          }
        });

        //res.json({status: "success", name: filename, 'url': url.parse(req.url) + "/uploads/" + filename})
      })
    });
  } else {
    res.json({status: "fail"});
  }
});

module.exports = router;