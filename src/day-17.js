const { getInputAsArray } = require('./lib');

function* simulate(dx, dy) {
  let x = 0, y = 0;

  while (true) {
    x += dx;
    y += dy;
    dx += dx < 0 ? +1 : dx > 0 ? -1 : 0;
    dy -= 1;
    yield [x, y];
  }
}

async function main() {
  const [_, x0, x1, y0, y1] = (await getInputAsArray())[0]
    .match(/^target area: x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)$/)
    .map(Number);

  let maxHeight = 0;
  let count = 0;

  for (let dx = 1; dx <= x1; ++dx) {
    for (let dy = y0; dy <= 1000; ++dy) {
      let max = 0;

      for (const [x, y] of simulate(dx, dy)) {
        // next maximum height
        if (y > max) max = y;

        // in the target
        if (x >= x0 && x <= x1 && y >= y0 && y <= y1) {
          count += 1;
          if (max > maxHeight) { maxHeight = max; }
          break;
        }

        // over the target
        if (x > x1 || y < y0) {
          break;
        }
      }
    }
  }

  console.log('part 1:', maxHeight); // 2628
  console.log('part 2:', count);     // 1334
}

main();