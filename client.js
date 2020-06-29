const net = require('net');
const redisCli = require('./RedisClient');

const createClient = function () {
  const socket = net.connect({ host: "127.0.0.1", port: 6379 });
  const client = new redisCli(socket);
  return client;
};

module.exports = { createClient };
