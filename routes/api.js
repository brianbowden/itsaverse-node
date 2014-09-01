var app = require('../app');
var express = require('express');
var router = express.Router();
var busboy = require('connect-busboy');
var url = require('url');

app.use(busboy());

router.post('/analyze', function(req, res) {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename);
    fstream = fs.createWriteStream(__dirname + '/public/uploads/' + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      res.json({status: "yep")});
      //res.json({status: "success", name: filename, 'url': url.parse(req.url) + "/uploads/" + filename})
    })
  });
});

module.exports = router;