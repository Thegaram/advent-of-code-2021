const { getInputAsArray } = require('./lib');

function parse(lines) {
  const points = lines.filter(l => l.includes(',')).map(l => l.split(',').map(Number));
  const folds = lines.filter(l => l.includes('=')).map(l => { const [str, coord] = l.split('='); return [str[str.length - 1], Number(coord)]; });
  return [points, folds];
}

function print(points) {
  const xmax = Math.max(...points.map(([x, _]) => x));
  const ymax = Math.max(...points.map(([_, y]) => y));

  for (let y = -1; y <= ymax + 1; ++y) {
    for (let x = -1; x <= xmax + 1; ++x) {
      const isPoint = points.some(([x2, y2]) => x2 == x && y2 == y);
      process.stdout.write(isPoint ? '█' : ' ');
    }
    process.stdout.write('\n');
  }
}

function fold(points, axis, coord) {
  return points.map(([x, y]) => {
    if (axis === 'x' && x <= coord) return [x, y];
    if (axis === 'x' && x  > coord) return [2 * coord - x, y];
    if (axis === 'y' && y <= coord) return [x, y];
    if (axis === 'y' && y  > coord) return [x, 2 * coord - y];
  });
}

async function main() {
  const [points, folds] = await getInputAsArray().then(parse);

  // ----------- part-1 -----------
  const set = new Set();
  fold(points, ...folds[0]).forEach(([x, y]) => set.add(`${x}-${y}`));
  console.log('part 1:', set.size);
  // 814

  // ----------- part-2 -----------
  const code = folds.reduce((ps, [axis, coord]) => fold(ps, axis, coord), points);
  console.log('part 2:')
  print(code);
  // PZEHRAER
}

main();