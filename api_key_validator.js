var config = require('./config');

function validate(req, res, next) {

  var apiKey = req.headers['api-key'];
  if (!apiKey) {
    unauthorized(res);
    return;
  } 

  var redis = require('redis'),
      client = redis.createClient();

  client.unref();
  client.sismember([config.redis_api_set, apiKey], function (err, reply) {
    if (err || !!!reply) {
      unauthorized(res);
      return;
    } else {
      next();
    }
  });

  function unauthorized(res) {
    res.status(400);
    res.json({status: "Unauthorized API key"});
  }
}

module.exports = validate;