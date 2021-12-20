const { getInputAsArray, update } = require('./lib');
const { identity, translate, rotateX, rotateY, rotateZ, mult, negate, transform, serialize, inv } = require('./matrix');

function parse(raw) {
  const scanners = [];

  for (const line of raw) {
    if (line === '') continue;

    if (line.match(/^--- scanner \d+ ---$/)) {
      scanners.push([]);
      continue;
    }

    if (line.match(/^(-?\d+),(-?\d+),(-?\d+)$/)) {
      const [_, x, y, z] = line.match(/^(-?\d+),(-?\d+),(-?\d+)$/);
      scanners[scanners.length - 1].push([x, y, z].map(Number));
    }
  }

  return scanners;
}

// collect all possible rotation matrices
function rotations() {
  let M = identity();

  let set = new Set();
  let matrices = [];

  for (let x = 0; x < 4; ++x) {
    for (let y = 0; y < 4; ++y) {
      for (let z = 0; z < 4; ++z) {
        M = mult(rotateZ(), M);

        if (!set.has(serialize(M))) {
          matrices.push(M);
        }
        set.add(serialize(M));
      }

      M = mult(rotateY(), M);
    }

    M = mult(rotateX(), M);
  }

  return matrices;
}

// find the intersection of two sets of vectors
function intersect(vs1, vs2) {
  const set = new Set();

  for (const v of vs1) {
    set.add(serialize(v));
  }

  return vs2.filter(v => set.has(serialize(v)));
}

async function main() {
  const scanners = await getInputAsArray().then(parse);
  const ROTATIONS = rotations();

  // find transformations between scanners
  const transformations = {};

  // ----------- part-1 -----------
  // check scanners, pairwise
  for (let ii = 0; ii < scanners.length - 1; ++ii) {
    pairs: for (let jj = ii + 1; jj < scanners.length; ++jj) {
      console.log(`checking ${ii}-${jj}...`);

      const s1 = scanners[ii];
      const s2 = scanners[jj];

      // check scanned beacons, pairwise
      for (let kk = 0; kk < s1.length - 12; ++kk) {
        for (let mm = 0; mm < s2.length; ++mm) {
          const v1 = s1[kk];
          const v2 = s2[mm];

          // find all possible transformations from v2 to v1
          const T1 = translate(negate(v2));
          const T2 = translate(v1);
          const ts = ROTATIONS.map(R => mult(T2, mult(R, T1)));

          for (const t of ts) {
            // transform all sensors in s2
            const s2_transformed = s2.map(v => transform(t, v));

            // count overlap
            if (intersect(s1, s2_transformed).length >= 12) {
              update(transformations, jj, ii, _ => t);
              update(transformations, ii, jj, _ => inv(t));
              continue pairs;
            }
          }
        }
      }
    }
  }

  // find or construct transformation `from` --> `to`
  const findTransformation = function(from, to) {
    let M = identity();
    const stack = [[from, M]];
    let set = new Set();

    while (stack.length > 0) {
      const [f, m] = stack.pop();
      if (f === to) return m;
      if (set.has(f)) continue;
      set.add(f);

      for (const t of Object.keys(transformations[f] || {})) {
        stack.push([t, mult(transformations[f][t], m)]);
      }
    }
  }

  // ----------- part-1 -----------
  const set = new Set();

  for (let ii = 0; ii < scanners.length; ++ii) {
    const t = findTransformation(`${ii}`, '0');

    for (let v of scanners[ii]) {
      v = transform(t, v);
      set.add(serialize(v));
    }
  }

  console.log('part 1:', set.size);
  // 491


  // ----------- part-2 -----------
  let max = 0;

  for (let ii = 0; ii < scanners.length - 1; ++ii) {
    for (let jj = ii + 1; jj < scanners.length; ++jj) {
      const t = findTransformation(`${jj}`, `${ii}`);
      const o = transform(t, [0, 0, 0]);
      const dist = Math.abs(o[0]) + Math.abs(o[1]) + Math.abs(o[2]);
      if (dist > max) max = dist;
    }
  }

  console.log('part 2:', max);
  // 13374
}

main();