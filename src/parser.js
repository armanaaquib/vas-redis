const stringParser = (splitted, idx, responses) => {
  responses.push({ res: splitted[idx].slice(1) });
  return 1;
};

const errorParser = (splitted, idx, responses) => {
  responses.push({ err: splitted[idx].slice(1) });
  return 1;
};

const integerParer = (splitted, idx, responses) => {
  responses.push({ res: +splitted[idx].slice(1) });
  return 1;
};

const bulkParser = (splitted, idx, responses) => {
  const length = +splitted[idx].slice(1);

  if (length == -1) {
    responses.push({ res: null });
    return 1;
  }

  responses.push({ res: splitted[idx + 1] });
  return 2;
};

const typeParser = {
  '+': stringParser,
  '-': errorParser,
  ':': integerParer,
  $: bulkParser,
};

const arrayParser = (splitted, index, responses) => {
  const length = +splitted[index].slice(1);
  const resp = [];

  let idx = index + 1;
  while (resp.length !== length) {
    const id = splitted[idx][0];
    const move = typeParser[id](splitted, idx, resp);
    idx += move;
  }

  responses.push({ res: resp.map((res) => res.res) });
  return idx - index;
};

typeParser['*'] = arrayParser;

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

    const move = typeParser[id](splitted, idx, responses);
    idx += move;
  }

  return responses;
};

const parseValue = function (values) {
  let joinedValues = JSON.stringify(values);

  if (typeof values === 'object') {
    joinedValues = values.reduce(
      (joinedValues, value) => `${joinedValues} "${value}"`
    );
  }

  return joinedValues;
};

module.exports = { parseResponse, parseValue };
