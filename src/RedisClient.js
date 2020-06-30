const { parse } = require('./parseResponse');

class RedisClient {
  constructor(socket) {
    this.socket = socket;
    this.socket.on('readable', () => this.gotResponse());
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
      this.callbacks.shift()(err ? err : null, res ? res : null);
    });
  }

  set(key, value, callback) {
    const command = `set ${key} ${value}\r\n`;
    this.callbacks.push(callback);
    this.socket.write(command);
  }

  get(key, callback) {
    const command = `get ${key}\r\n`;
    this.callbacks.push(callback);
    this.socket.write(command);
  }

  hgetall(key, callback) {
    const command = `hgetall ${key}\r\n`;
    this.callbacks.push(callback);
    this.socket.write(command);
  }

  close(callback) {
    const interval = setInterval(() => {
      if (!this.callbacks.length) {
        this.socket.end(callback);
        clearInterval(interval);
      }
    }, 1000);
  }
}

module.exports = RedisClient;
