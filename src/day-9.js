const { getInputAsArray } = require('./lib');

const MAX = 9;

function neighbors(row, col) {
  return [[row - 1, col], [row, col + 1], [row + 1, col], [row, col - 1]];
}

async function main() {
  const input = (await getInputAsArray()).map(_ => _.split('').map(Number));

  // pad map edges
  const map = input.map(line => [MAX, ...line, MAX]);
  map.unshift(map[0].map(_ => MAX));
  map.push(map[0].map(_ => MAX));

  // ----------- part-1 -----------
  let sum = 0;

  for (let r = 1; r < map.length - 1; r++) {
    for (let c = 1; c < map[0].length - 1; c++) {
      if (neighbors(r, c).every(([r2, c2]) => map[r][c] < map[r2][c2])) {
        sum += map[r][c] + 1;
      }
    }
  }

  console.log('part 1:', sum);
  // 580

  // ----------- part-2 -----------
  const visited = new Set();
  const sizes = [];

  for (let r = 1; r < map.length - 1; r++) {
    for (let c = 1; c < map[0].length - 1; c++) {
      const stack = [[r, c]];
      let size = 0;

      while (stack.length > 0) {
        const [r, c] = stack.pop();
        if (map[r][c] === MAX || visited.has(`${r}-${c}`)) continue;
        visited.add(`${r}-${c}`);
        size += 1;
        neighbors(r, c).forEach(n => stack.push(n));
      }

      if (size > 0) {
        sizes.push(size);
      }
    }
  }

  sizes.sort((a, b) => b - a);
  console.log('part 2:', sizes[0] * sizes[1] * sizes[2]);
  // 856716
}

main();