class RedisClient {
  constructor(socket) {
    this.socket = socket;
    this.socket.on('readable', () => {
      this.gotResponse()
    });
    this.callbacks = [];
  }

  gotResponse() {
    let data = '', chunk;
    while ((chunk = this.socket.read())) {
      data += chunk;
    }
    console.log(data);
  }

  set(key, value, callback) {
    key = JSON.stringify(key);
    value = JSON.stringify(value);
    const command = `set ${key} ${value}\r\n`;
    this.callbacks.push(callback);
    this.socket.write(command);
  }

  get(key, callback) {
    key = JSON.stringify(key);
    const command = `get ${key}\r\n`;
    this.callbacks.push(callback);
    this.socket.write(command);
  }
}

module.exports = RedisClient;
