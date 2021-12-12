const { clone, getInputAsArray } = require('./lib');

const DIM = 10;

function neighbors(row, col) {
  const all = [
    [row - 1, col - 1],
    [row - 1, col    ],
    [row - 1, col + 1],
    [row    , col - 1],
    [row    , col + 1],
    [row + 1, col - 1],
    [row + 1, col    ],
    [row + 1, col + 1],
  ];

  return all.filter(([r, c]) => r >= 0 && r < DIM && c >= 0 && c < DIM);
}

async function main() {
  const input = (await getInputAsArray()).map(_ => _.split('').map(Number));

  // ----------- part-1 & part-2 -----------
  let grid = input;
  let count = 0;
  let part1 = 0;
  let part2 = 0;

  for (let step = 1; step <= 1000; ++step) {
    grid = grid.map(row => row.map(n => n + 1)); // +1
    const flashed = new Set();

    while (true) {
      const newGrid = clone(grid);
      let hasFlash = false;

      for (let row = 0; row < DIM; ++row) {
        for (let col = 0; col < DIM; ++col) {
          if (grid[row][col] > 9) {
            count += 1;
            newGrid[row][col] = 0;
            hasFlash = true;
            flashed.add([row, col]);

            for (const [r, c] of neighbors(row, col)) {
              newGrid[r][c] += 1;
            }
          }
        }
      }

      grid = newGrid;
      if (!hasFlash) break;
    }

    for (const [row, col] of flashed) {
      grid[row][col] = 0;
    }

    if (step === 100) {
      part1 = count;
    }

    if (flashed.size === DIM * DIM) {
      part2 = step;
      break;
    }
  }


  console.log('part 1:', part1);
  // 1686

  console.log('part 2:', part2);
  // 360
}

main();