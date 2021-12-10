const { getInputAsArray } = require('./lib');

async function main() {
  const input = (await getInputAsArray()).map(_ => _.split(/(?:,|\s->\s)/).map(Number));

  // ----------- part-1 -----------
  const covered = new Map();

  for (let [x1, y1, x2, y2] of input) {
    // horizontal line
    if (y1 === y2) {
      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); ++x) {
        covered.set(`${x}-${y1}`, (covered.get(`${x}-${y1}`) || 0) + 1);
      }
    }

    // vertical line
    else if (x1 === x2) {
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); ++y) {
        covered.set(`${x1}-${y}`, (covered.get(`${x1}-${y}`) || 0) + 1);
      }
    }
  }

  const part1 = [...covered].filter(([_, n]) => n > 1).length;
  console.log('part 1:', part1);
  // 7380

  // ----------- part-2 -----------
  for (let [x1, y1, x2, y2] of input) {
    // downwards diagonal line
    if (x1 < x2 && y1 < y2 || x1 > x2 && y1 > y2) {
      const y = Math.min(y1, y2);

      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); ++x) {
        const step = x - Math.min(x1, x2);
        covered.set(`${x}-${y + step}`, (covered.get(`${x}-${y + step}`) || 0) + 1);
      }
    }

    // upwards diagonal line
    else if (x1 < x2 && y1 > y2 || x1 > x2 && y1 < y2) {
      const y = Math.max(y1, y2);

      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); ++x) {
        const step = x - Math.min(x1, x2);
        covered.set(`${x}-${y - step}`, (covered.get(`${x}-${y - step}`) || 0) + 1);
      }
    }
  }

  const part2 = [...covered].filter(([_, n]) => n > 1).length;
  console.log('part 2:', part2);
  // 21373
}

main();