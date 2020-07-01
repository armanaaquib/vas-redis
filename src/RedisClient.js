const { parseResponse, parseValue } = require('./parser');

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
      const { err, res } = response;
      const callback = this.#callbacks.shift();

      if (!callback && err) {
        throw err;
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
    this.#sendRequest(command, callback);
  }

  ping(callback) {
    const command = `PING\r\n`;
    this.#sendRequest(command, callback);
  }

  set(key, value, callback) {
    const command = `SET ${key} "${value}"\r\n`;
    this.#sendRequest(command, callback);
  }

  get(key, callback) {
    const command = `GET ${key}\r\n`;
    this.#sendRequest(command, callback);
  }

  lpush(key, values, callback) {
    const value = parseValue(values);
    const command = `LPUSH ${key} ${value}\r\n`;
    this.#sendRequest(command, callback);
  }

  rpush(key, values, callback) {
    const value = parseValue(values);
    const command = `RPUSH ${key} ${value}\r\n`;
    this.#sendRequest(command, callback);
  }

  lrange(key, start, end, callback) {
    const command = `LRANGE ${key} ${start} ${end}\r\n`;
    this.#sendRequest(command, callback);
  }

  lpop(key, callback) {
    const command = `LPOP ${key}\r\n`;
    this.#sendRequest(command, callback);
  }

  rpop(key, callback) {
    const command = `RPOP ${key}\r\n`;
    this.#sendRequest(command, callback);
  }

  ltrim(key, start, end, callback) {
    const command = `LTRIM ${key} ${start} ${end}\r\n`;
    this.#sendRequest(command, callback);
  }

  hset(key, field, value, callback) {
    const command = `HSET ${key} ${field} "${value}"\r\n`;
    this.#sendRequest(command, callback);
  }

  hget(key, field, callback) {
    const command = `HGET ${key} ${field}\r\n`;
    this.#sendRequest(command, callback);
  }

  hmset(key, fieldValues, callback) {
    const fieldValue = parseValue(fieldValues);
    const command = `HMSET ${key} ${fieldValue}\r\n`;
    this.#sendRequest(command, callback);
  }

  hmget(key, fields, callback) {
    const field = parseValue(fields);
    const command = `HMGET ${key} ${field}\r\n`;
    this.#sendRequest(command, callback);
  }

  hgetall(key, callback) {
    const command = `HGETALL ${key}\r\n`;
    this.#sendRequest(command, callback);
  }

  hexists(key, field, callback) {
    const command = `HEXISTS ${key} ${field}\r\n`;
    this.#sendRequest(command, callback);
  }

  keys(pattern, callback) {
    const command = `KEYS ${pattern} \r\n`;
    this.#sendRequest(command, callback);
  }

  blpop(keys, timeout, callback) {
    const key = parseValue(keys);
    console.log(key);
    const command = `BLPOP ${key} ${timeout} \r\n`;
    this.#sendRequest(command, callback);
  }

  brpop(keys, timeout, callback) {
    const key = parseValue(keys);
    const command = `BRPOP ${key} ${timeout} \r\n`;
    this.#sendRequest(command, callback);
  }

  rpoplpush(source, destination, callback) {
    const command = `RPOPLPUSH ${source} ${destination} \r\n`;
    this.#sendRequest(command, callback);
  }

  brpoplpush(source, destination, timeout, callback) {
    const command = `BRPOPLPUSH ${source} ${destination} ${timeout}\r\n`;
    this.#sendRequest(command, callback);
  }

  sadd(key, values, callback) {
    const value = parseValue(values);
    const command = `SADD ${key} ${value} \r\n`;
    this.#sendRequest(command, callback);
  }

  smembers(key, callback) {
    const command = `SMEMBERS ${key} \r\n`;
    this.#sendRequest(command, callback);
  }

  incr(key, callback) {
    const command = `INCR ${key} \r\n`;
    this.#sendRequest(command, callback);
  }

  incrBy(key, increment, callback) {
    const command = `INCRBY ${key} ${increment} \r\n`;
    this.#sendRequest(command, callback);
  }

  setnx(key, value, callback) {
    const command = `SETNX ${key} ${value} \r\n`;
    this.#sendRequest(command, callback);
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
