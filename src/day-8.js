const { getInputAsArray, permute } = require('./lib');

async function main() {
  const input = (await getInputAsArray()).map(_ => _.split(/(?:\s\|\s|\s)/));

  // ----------- part-1 -----------
  const part1 = input.reduce((acc, entry) => acc + entry.slice(10, 14).filter(s => [2, 3, 4, 7].includes(s.length)).length, 0);
  console.log('part 1:', part1);
  // 255

  // ----------- part-2 -----------
  const valid = {
    '0-1-2-4-5-6': 0,   // 0
    '2-5': 1,           // 1     // 0000
    '0-2-3-4-6': 2,     // 2     // 1    2
    '0-2-3-5-6': 3,     // 3     // 1    2
    '1-2-3-5': 4,       // 4     // 3333
    '0-1-3-5-6': 5,     // 5     // 4    5
    '0-1-3-4-5-6': 6,   // 6     // 4    5
    '0-2-5': 7,         // 7     // 6666
    '0-1-2-3-4-5-6': 8, // 8
    '0-1-2-3-5-6': 9,   // 9
  };

  const encode = (signal, config) =>
    signal                       // example: signal: 'abeg', config: ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    .split('')                   // ['a', 'b', 'e', 'g']
    .map(_ => config.indexOf(_)) // [0, 1, 4, 6]
    .sort((a, b) => a - b)       // [0, 1, 4, 6]
    .join('-');                  // '0-1-4-6'

  let sum = 0;

  for (const entry of input) {
    search: for (const config of permute(['a', 'b', 'c', 'd', 'e', 'f', 'g'])) {
      // check if we find any invalid encodings in the signals
      for (const signal of entry.slice(0, 10)) {
        if (!Object.keys(valid).includes(encode(signal, config))) { continue search; }
      }

      // found valid configuration => encode output and stop
      const num = entry.slice(10, 14)
        .map(output => valid[encode(output, config)])
        .reduce((acc, digit) => acc * 10 + digit);

      sum += num;
      break search;
    }
  }

  console.log('part 2:', sum);
  // 982158
}

main();