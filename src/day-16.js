const { getInputAsArray } = require('./lib');

function hexToBinary(hex) {
    return hex.match(/.{1,2}/g).map(chunk => parseInt(chunk, 16).toString(2).padStart(8, '0')).join('')
}

function process(packet, ptr, f) {
  const read = (count) => {
    let n = 0;
    while (count--) n = 2 * n + Number(packet[ptr++]);
    return n;
  };

  // version, type ID
  const V = read(3);
  const T = read(3);
  f(V, T);

  // literal
  if (T === 4) {
    let N = 0;

    while (true) {
      const isLast = read(1) === 0;
      N = 16 * N + read(4);
      if (isLast) break;
    }

    return [ptr, N];
  }

  // else: operator
  const I = read(1);
  const values = [];

  // length mode
  if (I === 0) {
    const length = read(15);
    const limit = ptr + length;

    while (true) {
      const [ptr2, v] = process(packet, ptr, f);
      ptr = ptr2;
      values.push(v);
      if (ptr === limit) break;
    }
  }

  // packet count mode
  else {
    const number = read(11);

    for (let ii = 0; ii < number; ++ii) {
      const [ptr2, v] = process(packet, ptr, f);
      ptr = ptr2;
      values.push(v);
    }
  }

  // process sub-results
  switch (T) {
    case 0: return [ptr, values.reduce((acc, x) => acc + x)];
    case 1: return [ptr, values.reduce((acc, x) => acc * x)];
    case 2: return [ptr, Math.min(...values)];
    case 3: return [ptr, Math.max(...values)];
    case 5: return [ptr, values[0] > values[1] ? 1 : 0];
    case 6: return [ptr, values[0] < values[1] ? 1 : 0];
    case 7: return [ptr, values[0] === values[1] ? 1 : 0];
  }
}

async function main() {
  const input = (await getInputAsArray())[0];

  let sum = 0;
  const [_, res] = process(hexToBinary(input), 0, V => sum += V);
  console.log('part 1:', sum);
  console.log('part 2:', res);
}

main();