const net = require('net');
const redisClient = require('./src/RedisClient');

const parseHostPost = (options) => {
  const host = (options && options.host) || '127.0.0.1';
  const port = (options && options.port) || 6379;

  return { host, port };
};

const createClient = function (options) {
  const socket = net.connect(parseHostPost(options));
  return new redisClient(socket, options);
};

module.exports = { createClient };
