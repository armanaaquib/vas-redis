const stringParser = (splitted, idx, responses) => {
  responses.push({ res: splitted[idx].slice(1), err: null });
  return idx + 1;
};

const errorParser = (splitted, idx, responses) => {
  responses.push({ err: splitted[idx].slice(1), res: null });
  return idx + 1;
};

const integerParer = (splitted, idx, responses) => {
  responses.push({ res: +splitted[idx].slice(1), err: null });
  return idx + 1;
};

const bulkParser = (splitted, idx, responses) => {
  const length = +splitted[idx].slice(1);

  if (length == -1) {
    responses.push({ res: null, err: null });
    return idx + 1;
  }

  responses.push({ res: splitted[idx + 1], err: null });
  return idx + 2;
};

const arrayParser = (splitted, idx, responses) => {
  const length = +splitted[idx].slice(1);
  if (length == -1) {
    responses.push({ res: null });
    return idx + 1;
  }
  const resp = [];

  idx += 1;
  while (resp.length !== length) {
    const id = splitted[idx][0];
    idx = typeParser[id](splitted, idx, resp);
  }

  responses.push({ res: resp.map((res) => res.res), err: null });
  return idx;
};

const typeParser = {
  '+': stringParser,
  '-': errorParser,
  ':': integerParer,
  $: bulkParser,
  '*': arrayParser,
};

const parseResponse = (response) => {
  const splitted = response.split('\r\n');
  const responses = [];
  const ids = ['+', '-', ':', '$', '*'];

  let idx = 0;
  while (idx < splitted.length) {
    const id = splitted[idx][0];

    if (!ids.includes(id)) {
      break;
    }

    idx = typeParser[id](splitted, idx, responses);
  }

  return responses;
};

const parseValue = function (values) {
  let joinedValues = JSON.stringify(values);

  if (typeof values === 'object') {
    joinedValues = values.reduce((joinedValues, value) => `${joinedValues} "${value}"`);
  }

  return joinedValues;
};

module.exports = { parseResponse, parseValue };
