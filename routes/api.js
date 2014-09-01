var express = require('express');
var router = express.Router();
var busboy = require('connect-busboy');
var url = require('url');
var fs = require('fs');
var path = require('path');
var tess = require('node-tesseract');
var uuid = require('node-uuid');

var filepath;

router.post('/analyze', function(req, res) {
  var fstream;
  debugger;

  if (!req.params.key || req.params.key !=== process.env.ITSAVERSE_API_KEY) {
    res.status(400);
    res.json({status: "unauthorized"});
    return;
  }

  if (req.busboy) {
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
      filename = uuid.v1();

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
      })
    });
  } else {
    res.json({status: "fail"});
  }
});

module.exports = router;