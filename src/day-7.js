const { getInputAsArray } = require('./lib');

async function main() {
  const input = (await getInputAsArray())[0].split(',').map(Number).sort((a, b) => a - b);

  // ----------- part-1 -----------
  let distance = input.reduce((acc, x) => acc + x); // assume leftmost is 0
  let index = 0;

  for (let pos = 1; true; ++pos) {
    while(input[index] < pos) { index += 1; }
    const d = distance + index - (input.length - index);
    if (d >= distance) { break; }
    distance = d;
  }

  console.log('part 1:', distance);
  // 345197

  // ----------- part-2 -----------
  let cost = Number.MAX_SAFE_INTEGER;

  for (let pos = 0; true; ++pos) {
    const c = input.reduce((acc, x) => acc + Math.abs(x - pos) * (Math.abs(x - pos) + 1) / 2, 0);
    if (c > cost) { break; }
    cost = c;
  }

  console.log('part 2:', cost);
  // 96361606
}

main();