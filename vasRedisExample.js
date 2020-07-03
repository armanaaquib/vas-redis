const redis = require('./vas-redis');
const client = redis.createClient({ db: 1 });

client.ping((err, res) => {
  if (err) {
    throw err;
  }
  console.log(res);
});

client.select(10);

// key value
client.set('message', 'Hello step7', (err, res) => {
  console.log(res);
});
client.get('message', (err, res) => console.log(res));
client.mset({ m1: 'Hello', m2: 'step', m3: '7' }, (err, res) => {
  console.log(res);
});
client.mget(['m1', 'm2', 'm3'], (err, res) => {
  console.log(res);
});

//list
client.lpush('list', 1);
client.lpush('list', [2, 3, 4], (err, res) => console.log(res));
client.lrange('list', 0, 100, (err, res) => {
  console.log(res);
});
client.rpush('list', 'a');
client.rpush('list', ['b', 'c', 'd'], (err, res) => console.log(res));
client.lrange('list', 0, 100, (err, res) => {
  console.log(res);
});
client.ltrim('list', 0, 10, (err, res) => {
  console.log(res);
});
client.lrange('list', 0, 100, (err, res) => {
  console.log(res);
});
client.lpop('list', (err, res) => console.log(res));
client.rpop('list', (err, res) => console.log(res));
client.blpop('l', 1, (err, res) => {
  console.log(res);
});
client.brpop('l', 1, (err, res) => {
  console.log(res);
});
client.rpoplpush('list', 'list1', (err, res) => {
  console.log(res);
});
client.lrange('list1', 0, 100, (err, res) => {
  console.log(res);
});
client.brpoplpush('list', 'list1', 1, (err, res) => {
  console.log(res);
});
client.lrange('list1', 0, 100, (err, res) => {
  console.log(res);
});

//hash
client.hset('myHash', 'field1', 'hello');
client.hget('myHash', 'field1', (err, res) => {
  console.log(res);
});
client.hmset('myHash', { field2: 'world', field3: '!' });
client.hmget('myHash', ['field1', 'field2', 'field3', 'noField'], (err, res) =>
  console.log(res)
);
client.hgetall('myHash', (err, res) => {
  console.log(res);
});
client.hexists('myHash', 'field1', (err, res) => console.log(res));
client.hexists('myHash', 'filed10', (err, res) => console.log(res));

//sets
client.sadd('set', 'uniq');
client.sadd('set', ['uniq', 'uniq'], (err, res) => {
  console.log(res);
});
client.smembers('set', (err, res) => {
  console.log(res);
});
client.setnx('key', 'done', (err, res) => {
  console.log(res);
});
client.setnx('key', 'again done', (err, res) => {
  console.log(res);
});
client.get('key', (err, res) => {
  console.log(res);
});

//incr
client.incr('id', (err, res) => {
  console.log(res);
});
client.incrby('id', 5, (err, res) => {
  console.log(res);
});

client.close(() => console.log('Connection closed.'));
