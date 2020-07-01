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

      callback && callback(err ? err : null, res ? res : null);
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

  hgetall(key, callback) {
    const command = `HGETALL ${key}\r\n`;
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
