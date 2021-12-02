const { getInputAsArray } = require('./lib');

async function main() {
  const input = (await getInputAsArray()).map(_ => [_.split(' ')[0], Number(_.split(' ')[1])]);

  // ----------- part-1 -----------
  let [x, y] = input.reduce(([x, y], [dir, step]) => { switch (dir) {
    case 'forward': return [x + step, y];
    case 'down': return [x, y + step];
    case 'up': return [x, y - step];
  }}, [0, 0]);

  const part1 = x * y;
  console.log('part 1:', part1);
  // 2091984

  // ----------- part-2 -----------
  [x, y] = input.reduce(([x, y, aim], [dir, step]) => { switch (dir) {
    case 'forward': return [x + step, y + aim * step, aim];
    case 'down': return [x, y, aim + step];
    case 'up': return [x, y, aim - step];
  }}, [0, 0, 0]);

  const part2 = x * y;
  console.log('part 2:', part2);
}

main();