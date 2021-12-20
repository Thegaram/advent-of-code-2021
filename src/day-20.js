const { getInputAsArray } = require('./lib');

function parse(raw) {
  const algo = raw[0];

  const NUM_ROWS = raw.length - 2;
  const NUM_COLS = raw[2].length;
  const pixels = {};

  for (let row = 0; row < NUM_ROWS; ++row) {
    for (let col = 0; col < NUM_COLS; ++col) {
      pixels[`${row}-${col}`] = raw[row + 2][col];
    }
  }

  const image = { pixels, r0: 0, r1: NUM_ROWS - 1, c0: 0, c1: NUM_COLS - 1, default: '.', };
  return [algo, image];
}

function binary(pixel) {
  return pixel === '#' ? 1 : 0;
}

function window(image, row, col) {
  const w = [
    [row - 1, col - 1],
    [row - 1, col    ],
    [row - 1, col + 1],
    [row    , col - 1],
    [row    , col    ],
    [row    , col + 1],
    [row + 1, col - 1],
    [row + 1, col    ],
    [row + 1, col + 1],
  ];

  return w.reduce((acc, [r, c]) => 2 * acc + binary(image.pixels[`${r}-${c}`] || image.default), 0);
}

function enhance(image, algo, times = 1) {
  for (let ii = 0; ii < times; ++ii) {
    const image2 = {
      pixels: {},
      r0: image.r0 - 3,
      r1: image.r1 + 3,
      c0: image.c0 - 3,
      c1: image.c1 + 3,
      default: algo[window(image, image.r0 - 3, image.c0 - 3)],
    };

    for (let row = image2.r0; row <= image2.r1; ++row) {
      for (let col = image2.c0; col <= image2.c1; ++col) {
        image2.pixels[`${row}-${col}`] = algo[window(image, row, col)];
      }
    }

    image = image2;
  }

  return image;
}

function count(image) {
  return Object.values(image.pixels).filter(px => px === '#').length;
}

async function main() {
  const [algo, image] = await getInputAsArray().then(parse);

  // ----------- part-1 -----------
  console.log('part 1:', count(enhance(image, algo, 2)));
  // 5326

  // ----------- part-2 -----------
  console.log('part 2:', count(enhance(image, algo, 50)));
  // 17096
}

main();
