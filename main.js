const redis = require('./vas-redis');

const client = redis.createClient({ db: 1 });

client.ping((err, res) => console.log(res));

client.set('message', 'Hello step7');
client.get('message', (err, res) => console.log(res));

client.select(2, (err, res) => console.log(res));

client.close(() => {
  console.log('connection closed.');
});
