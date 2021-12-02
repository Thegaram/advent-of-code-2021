const { getInputAsArray } = require('./lib');

async function main() {
  const input = (await getInputAsArray()).map(Number);

  // ----------- part-1 -----------
  const part1 = input.filter((_, i, ns) => ns[i] < ns[i + 1]).length;
  console.log('part 1:', part1);
  // 1387

  // ----------- part-2 -----------
  const part2 = input.filter((_, i, ns) => (ns[i] + ns[i + 1] + ns[i + 2]) < ns[i + 1] + ns[i + 2] + ns[i + 3]).length;
  console.log('part 2:', part2);
  // 1362
}

main();