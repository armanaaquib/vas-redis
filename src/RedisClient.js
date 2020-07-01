const {
  parseResponse,
  parseValue,
  reshapeResponse,
  parseValueFromObj,
} = require('./parser');

class RedisClient {
  #socket;
  #callbacks;

  constructor(socket, options) {
    this.#socket = socket;
    this.#callbacks = [];
    this.#socket.on('readable', this.#gotResponse.bind(this));
    options && this.select(options.db);
  }

  #gotResponse = () => {
    let data = '',
      chunk;

    while ((chunk = this.#socket.read())) {
      data += chunk;
    }

    const responses = parseResponse(data);
    this.#callCallbacks(responses);
  };

  #callCallbacks = (responses) => {
    responses.forEach((response) => {
      let { err, res } = response;
      const { callback, type } = this.#callbacks.shift();

      if (!callback && err) {
        throw err;
      }

      if (res) {
        res = reshapeResponse(res, type);
      }

      callback && callback(err, res);
    });
  };

  #sendRequest = (command, callback) => {
    this.#callbacks.push(callback);
    this.#socket.write(command);
  };

  select(db, callback) {
    const command = `SELECT "${db}"\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  ping(callback) {
    const command = `PING\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  set(key, value, callback) {
    const command = `SET ${key} "${value}"\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  get(key, callback) {
    const command = `GET ${key}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  mset(keyValues, callback) {
    const keyValue = parseValueFromObj(keyValues);
    const command = `MSET ${keyValue}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  mget(keys, callback) {
    const key = parseValue(keys);
    const command = `MGET ${key}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  lpush(key, values, callback) {
    const value = parseValue(values);
    const command = `LPUSH ${key} ${value}\r\n`;
    this.#sendRequest(command, { callback, type: 'integer' });
  }

  rpush(key, values, callback) {
    const value = parseValue(values);
    const command = `RPUSH ${key} ${value}\r\n`;
    this.#sendRequest(command, { callback, type: 'integer' });
  }

  lrange(key, start, end, callback) {
    const command = `LRANGE ${key} ${start} ${end}\r\n`;
    this.#sendRequest(command, { callback, type: 'array' });
  }

  lpop(key, callback) {
    const command = `LPOP ${key}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  rpop(key, callback) {
    const command = `RPOP ${key}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  ltrim(key, start, end, callback) {
    const command = `LTRIM ${key} ${start} ${end}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  hset(key, field, value, callback) {
    const command = `HSET ${key} ${field} "${value}"\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  hget(key, field, callback) {
    const command = `HGET ${key} ${field}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  hmset(key, fieldValues, callback) {
    const fieldValue = parseValueFromObj(fieldValues);
    const command = `HMSET ${key} ${fieldValue}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  hmget(key, fields, callback) {
    const field = parseValue(fields);
    const command = `HMGET ${key} ${field}\r\n`;
    this.#sendRequest(command, { callback, type: 'array' });
  }

  hgetall(key, callback) {
    const command = `HGETALL ${key}\r\n`;
    this.#sendRequest(command, { callback, type: 'hash' });
  }

  hexists(key, field, callback) {
    const command = `HEXISTS ${key} ${field}\r\n`;
    this.#sendRequest(command, { callback, type: 'integer' });
  }

  keys(pattern, callback) {
    const command = `KEYS ${pattern}\r\n`;
    this.#sendRequest(command, { callback, type: 'array' });
  }

  blpop(keys, timeout, callback) {
    const key = parseValue(keys);
    const command = `BLPOP ${key} ${timeout}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  brpop(keys, timeout, callback) {
    const key = parseValue(keys);
    const command = `BRPOP ${key} ${timeout}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  rpoplpush(sk, dk, callback) {
    const command = `RPOPLPUSH ${sk} ${dk}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  brpoplpush(source, destination, timeout, callback) {
    const command = `BRPOPLPUSH ${source} ${destination} ${timeout}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  sadd(key, values, callback) {
    const value = parseValue(values);
    const command = `SADD ${key} ${value}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  smembers(key, callback) {
    const command = `SMEMBERS ${key}\r\n`;
    this.#sendRequest(command, { callback, type: 'set' });
  }

  incr(key, callback) {
    const command = `INCR ${key}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  incrby(key, increment, callback) {
    const command = `INCRBY ${key} ${increment}\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  setnx(key, value, callback) {
    const command = `SETNX ${key} "${value}"\r\n`;
    this.#sendRequest(command, { callback, type: 'string' });
  }

  close(callback) {
    const closeInterval = setInterval(() => {
      if (!this.#callbacks.length) {
        this.#socket.end(callback);
        clearInterval(closeInterval);
      }
    }, 1000);
  }
}

module.exports = RedisClient;
