const { getInputAsArray } = require('./lib');

function countFishes(input, days) {
  const counts = {};
  [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(x => counts[x] = 0);
  input.forEach(x => counts[x] = counts[x] + 1 );

  for (let day = 0; day < days; day++) {
    for (let ii = -1; ii <= 8; ++ii) {
      counts[ii] = counts[ii + 1] || 0;
    }

    counts[6] += counts[-1];
    counts[8] += counts[-1];
  }

  counts[-1] = 0;
  return Object.values(counts).reduce((acc, x) => acc + x);
}

async function main() {
  const input = (await getInputAsArray())[0].split(',').map(Number);

  // ----------- part-1 -----------
  console.log('part 1:', countFishes(input, 80));
  // 388739

  // ----------- part-2 -----------
  console.log('part 2:', countFishes(input, 256));
  // 1741362314973
}

main();