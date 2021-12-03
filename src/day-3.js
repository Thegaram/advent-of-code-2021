const { getInputAsArray } = require('./lib');

function transpose(array) {
  return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
}

function toInt(acc, bit) {
  return acc * 2 + bit;
}

async function main() {
  const input = (await getInputAsArray());
  const M = input.map(_ => _.split('').map(Number));

  // ----------- part-1 -----------
  const MT = transpose(M);
  const counts = MT.map(col => col.reduce((acc, x) => acc + x - 0.5, 0));
  const gamma = counts.map(_ => _ > 0).reduce(toInt);
  const epsilon = counts.map(_ => _ < 0).reduce(toInt);
  console.log('part 1:', gamma * epsilon);
  // 738234

  // ----------- part-2 -----------
  let A = M;
  var B = M;

  for (let pos = 0; pos < M[0].length; ++pos) {
    if (A.length > 1) {
      const AT = transpose(A);
      const count = AT[pos].reduce((acc, x) => acc + x - 0.5, 0);
      A = A.filter(row => row[pos] === Number(count >= 0));
    }

    if (B.length > 1) {
      const BT = transpose(B);
      const count = BT[pos].reduce((acc, x) => acc + x - 0.5, 0);
      B = B.filter(row => row[pos] === Number(count < 0));
    }
  }

  const ogr = A[0].reduce(toInt);
  const csr = B[0].reduce(toInt);
  console.log('part 2:', ogr * csr);
  // 3969126
}

main();