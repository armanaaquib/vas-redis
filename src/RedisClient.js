const { parse } = require('./parseResponse');

class RedisClient {
  constructor(socket) {
    this.socket = socket;
    this.socket.on('readable', this.gotResponse.bind(this));
    this.callbacks = [];
  }

  gotResponse() {
    let data = '',
      chunk;

    while ((chunk = this.socket.read())) {
      data += chunk;
    }

    const responses = parse(data);

    responses.forEach((response) => {
      const { err, res } = response;
      const callback = this.callbacks.shift();
      callback(err ? err : null, res ? res : null);
    });
  }

  set(key, value, callback) {
    const command = `SET ${key} ${value}\r\n`;
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
    this.callbacks.push(callback);
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
