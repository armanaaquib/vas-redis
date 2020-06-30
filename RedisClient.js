const breakThis = function (string) {
  const splitted = string.split('\r\n');
  const doThis = function (array, i, responses) {
    const identifier = array[i][0];
    if (identifier == '+') {
      responses.push({ out: array[i].slice(1) });
      return i + 1;
    } else if (identifier == ':') {
      responses.push({ out: +array[i].slice(1) });
      return i + 1;
    } else if (identifier == '-') {
      responses.push({ err: array[i].slice(1) });
      return i + 1;
    } else if (identifier == '$') {
      if (+array[i].slice(1) == -1) {
        responses.push({ out: null });
        return i + 1;
      } else {
        responses.push({ out: array[i + 1] });
        return i + 2;
      }
    } else if (identifier == '*') {
      let resp = [],
        length = +array[i].slice(1);
      i++;
      while (resp.length != length) {
        i = doThis(array, i, resp);
      }
      responses.push({ out: resp.map((r) => r.out) });
      return i;
    }
  };
  let i = 0,
    responses = [];
  while (i < splitted.length) {
    i = doThis(splitted, i, responses);
  }
  return responses;
};

class RedisClient {
  constructor(socket) {
    this.socket = socket;
    this.socket.on('readable', () => {
      this.gotResponse();
    });
    this.callbacks = [];
  }

  gotResponse() {
    let data = '',
      chunk;
    while ((chunk = this.socket.read())) {
      data += chunk;
    }
    const response = breakThis(data);
    response.forEach((res) => {
      const { err, out } = res;
      this.callbacks.shift()(err ? err : null, out ? out : null);
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
