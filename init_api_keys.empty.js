var redis = require('redis'),
    client = redis.createClient();

var set = "itsaverseapikeys";

client.on("error", function (err) {
  console.error(err);
});

var keys = [];

client.del(set);

keys.forEach(function(key) {
  client.sadd(set, key);
  console.log("Adding API Key");
});

client.quit();