import { sumBy, toNumber, minBy, maxBy } from 'lodash-es'

const iterateeFn = key => row => toNumber(row[key]);

const SUM = data => key => sumBy(data, iterateeFn(key));

const MIN = data => key => minBy(data, iterateeFn(key))[key];

const MAX = data => key => maxBy(data, iterateeFn(key))[key];

const AVG = data => key => {
  const length = data.length || 0;
  if (length === 0) return 0;
  const totalSum = SUM(data)(key);
  return (totalSum / length).toFixed(2);
}

const $operations = new Map([
  ['SUM', SUM],
  ['MIN', MIN],
  ['MAX', MAX],
  ['AVG', AVG]
]);

export const runAggregator = (aggregateFn: string, data: object[], key: string) => {
  const aggregateFnUpper = aggregateFn.toUpperCase();
  if ($operations.has(aggregateFnUpper)) {
    return $operations.get(aggregateFnUpper)(data)(key);
  }
  throw new Error('Specified Aggregator function does not exists');
}
