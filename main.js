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

client.lrange('list', 0, 100, (err, res) => {
  console.log(res);
});

client.lrange('wrongList', 0, 100, (err, res) => {
  console.log(res);
});

client.lpop('list', (err, res) => console.log(res));
client.rpop('list', (err, res) => console.log(res));

client.hset('myHash', 'field1', 'hello');
client.hget('myHash', 'field1', (err, res) => {
  console.log(res);
});

client.hmset('myHash', ['field2', 'world', 'field3', '!']);
client.hmget('myHash', ['field1', 'field2', 'field3', 'noField'], (err, res) =>
  console.log(res)
);

client.close(() => {
  console.log('connection closed.');
});
