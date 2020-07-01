const { parse } = require('./parseResponse');

class RedisClient {
  constructor(socket, options) {
    this.socket = socket;
    this.socket.on('readable', this.gotResponse.bind(this));
    this.callbacks = [];
    options && this.select(options.db);
  }

  gotResponse() {
    let data = '',
      chunk;

    while ((chunk = this.socket.read())) {
      data += chunk;
    }

    const responses = parse(data);
    this.callCallbacks(responses);
  }

  callCallbacks(responses) {
    responses.forEach((response) => {
      const { err, res } = response;
      const callback = this.callbacks.shift();

      if (!callback && err) {
        throw err;
      }

      callback && callback(err ? err : null, res ? res : null);
    });
  }

  select(db, callback) {
    const command = `SELECT "${db}"\r\n`;
    this.callbacks.push(callback);
    this.socket.write(command);
  }

  set(key, value, callback) {
    const command = `SET ${key} "${value}"\r\n`;
    this.callbacks.push(callback);
    this.socket.write(command);
  }

  get(key, callback) {
    const command = `GET ${key}\r\n`;
    this.callbacks.push(callback);
    this.socket.write(command);
  }

  hgetall(key, callback) {
    const command = `HGETALL ${key}\r\n`;
    this.socket.write(command);
  }

  close(callback) {
    const closeInterval = setInterval(() => {
      if (!this.callbacks.length) {
        this.socket.end(callback);
        clearInterval(closeInterval);
      }
    }, 1000);
  }
}

module.exports = RedisClient;
