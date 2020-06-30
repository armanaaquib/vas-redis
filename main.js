const redis = require('./client');

const client = redis.createClient();

client.set("a", 10, (err, out) => {
  console.log(err, out);
});

client.get("a", (err, out) => {
  console.log(err, out);
});

client.get("z", (err, out) => {
  console.log(err, out);
});

client.hgetall("intern", (err, out) => {
  console.log(err, out);
});
