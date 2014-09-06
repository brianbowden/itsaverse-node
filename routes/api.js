var express = require('express');
var router = express.Router();
var busboy = require('connect-busboy');
var url = require('url');
var fs = require('fs');
var path = require('path');
var tessLib = require('tesseract'),
    tess = new tessLib.BaseApi();
var uuid = require('node-uuid');
var apiKeyValidator = require('../api_key_validator');

var filepath;

router.use(apiKeyValidator);

router.post('/analyze', function(req, res) {
  var fstream;

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

        try {
          console.log("Initializing Tesseract");
          tess.init("eng");
          console.log("Setting Tesseract Image");
          tess.setImage(filepath);
          console.log("Processing Tesseract Image");
          tess.recognize();
          console.log("------Printing Text------");
          debugger;
          var text = tess.getText();
          console.log(text);
          res.json({status: "yep", 'image_text': text});
          tess.close();
          tess.end();

        } catch (err) {
          console.error(err);
          res.json({status: "nope", 'error': err});
        }

        console.log("Deleting Local Image")
        fs.unlink(filepath, function(err) {
          if (err) {
            console.error(err);
          }
        });

        /**tess.process(filepath, function(err, text) {
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
        });**/
      })
    });
  } else {
    res.json({status: "fail"});
  }
});

module.exports = router;