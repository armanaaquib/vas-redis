# redis-client

## What is redis-client?
```
Redis-cli is the module, a simple program that allows to send commands to Redis, and read the replies sent by the server.
```

##Usage

### For selecting the database use this commands...
```
select
```
### For storing the data use these commands...
```
set, mset, select, lpush, lpush,rpush, lrange, ltrim, hset, hmset, rpoplpush, brpoplpush, sadd, incr, incrby
```
### For querying the data use these commands...
```
get, mget, lrange,lpop, rpop, hget, hgetall, hexists, blpop, brpop, smembers, hmget, keys
```
### For close the connection use this commands...
```
close
```

## Examples:-

### Key-values commands
```
key value
client.set('message', 'Hello step7', (err, res) => {
  console.log(res);  // expected output:- Ok
});
client.get('message', (err, res) => console.log(res));
client.mset({ m1: 'Hello', m2: 'step', m3: '7' }, (err, res) => {
  console.log(res);  // expected output:- OK
});
client.mget(['m1', 'm2', 'm3'], (err, res) => {
  console.log(res);  // expected output:- [ 'Hello', 'step', '7' ]
});
```

### List commands...
```
client.lpush('list', [2, 3, 4], (err, res) => console.log(res));
client.lrange('list', 0, 100, (err, res) => {
  console.log(res);  // expected output:- [ '4', '3', '2', '1' ]
});

client.rpush('list1', 'a');
client.rpush('list1', ['b', 'c', 'd'], (err, res) => console.log(res));
client.lrange('list', 0, 100, (err, res) => {
  console.log(res);  // expected output:- [ 'a', 'b', 'c', 'd' ]
});

client.ltrim('list', 0, 10, (err, res) => {
  console.log(res);  // expected output:- OK
});

client.lpop('list', (err, res) => console.log(res));  // expected output:- 4

client.rpop('list', (err, res) => console.log(res));  // expected output:-  1

client.blpop('l', 1, (err, res) => {
  console.log(res);  // expected output:- null
});

client.brpop('l', 1, (err, res) => {
  console.log(res);  // expected output:- null
});

client.rpoplpush('list', 'list1', (err, res) => {
  console.log(res);  // expected output:- 2
});

client.lrange('list1', 0, 100, (err, res) => {
  console.log(res);  // expected output:- ['a','b','c','d','2']
});

client.brpoplpush('list', 'list1', 1, (err, res) => {
  console.log(res);  // expected output:- 3
});

client.lrange('list1', 0, 100, (err, res) => {
  console.log(res);  // expected output:- 'a','b','c','d', '3']
});

```

### Hash commands...
```
client.hset('myHash', 'field1', 'hello');

client.hget('myHash', 'field1', (err, res) => {
  console.log(res);  // expected output:- hello
});

client.hmset('myHash', { field2: 'world', field3: '!' });

client.hmget('myHash', ['field1', 'field2', 'field3', 'noField'], (err, res) => console.log(res));  // expected output:- [ 'hello', 'world', '!', null ]

client.hgetall('myHash', (err, res) => {
  console.log(res);  // expected output:- { field1: 'hello', field2: 'world', field3: '!' }
});

client.hexists('myHash', 'field1', (err, res) => console.log(res));  // expected output:- 1

client.hexists('myHash', 'filed10', (err, res) => console.log(res));  // expected output:- 0
```

### Set commands...
```
client.sadd('set', 'uniq', (err, res) => {
  console.log(res)  // expected output:- 1
});

client.sadd('set', ['uniq', 'uniq'], (err, res) => {
  console.log(res);  // expected output:- 0
});

client.smembers('set', (err, res) => {
  console.log(res);  // expected output:- Set {'uniq'}
});

client.setnx('key', 'done', (err, res) => {
  console.log(res);  // expected output:- 1
});

client.setnx('key', 'again done', (err, res) => {
  console.log(res);  // expected output:- 0
});

client.get('key', (err, res) => {
  console.log(res);  // expected output:- done
});

```
### increment commands...
```
//incr
client.incr('id', (err, res) => {
  console.log(res); // expected output:- 1
});
client.incrby('id', 5, (err, res) => {
  console.log(res); ?? expected output:- 6
});

```

### For closing and selecting database...
```
client.close(() => console.log('Connection closed.'));
client.select(10);
```
