const redis = require('./vas-redis');
const client = redis.createClient({ db: 1 });

client.ping((err, res) => console.log(res));

client.set('message', 'Hello step7');
client.get('message', (err, res) => console.log(res));

client.select(2, (err, res) => console.log(res));

client.lpush('list', 1);
client.lpush('list', [2, 3, 4], (err, res) => console.log(res));

client.rpush('list', 'a');
client.rpush('list', ['b', 'c', 'd'], (err, res) => console.log(res));

client.close(() => {
  console.log('connection closed.');
});
