const { getInputAsArray, plus, update } = require('./lib');

const PLACEHOLDER = 'X';

function parse(input) {
  const template = [PLACEHOLDER, ...input[0].split(''), PLACEHOLDER];
  const rules = input.slice(2).map(_ => _.split(' -> ')).reduce((rs, [[a, b], to]) => update(rs, a, b, _ => to), {});
  return [template, rules];
}

function initialize(template) {
  // represent polymer as pair counts
  const polymer = {};

  for (let ii = 0; ii < template.length - 1; ++ii) {
    const a = template[[ii]];
    const b = template[[ii + 1]];
    update(polymer, a, b, plus(1));
  }

  return polymer;
}

function step(before, rules) {
  const after = {};

  for (const a of Object.keys(before)) {
    for (const b of Object.keys(before[a])) {
      const c = rules[a] && rules[a][b];

      if (c) {
        update(after, a, c, plus(before[a][b]));
        update(after, c, b, plus(before[a][b]));
      } else {
        update(after, a, b, plus(before[a][b]));
      }
    }
  }

  return after;
}

function answer(pairs) {
  const counts = {};

  for (const a of Object.keys(pairs)) {
    for (const b of Object.keys(pairs[a])) {
      update(counts, a, plus(pairs[a][b]));
      update(counts, b, plus(pairs[a][b]));
    }
  }

  delete(counts[PLACEHOLDER]);
  return Math.max(...Object.values(counts)) / 2 - Math.min(...Object.values(counts)) / 2;
}

function solve(template, rules, steps) {
  let p = initialize(template);
  for (let s = 1; s <= steps; ++s) { p = step(p, rules); }
  return answer(p);
}

async function main() {
  const [template, rules] = await getInputAsArray().then(parse);

  // ----------- part-1 -----------
  console.log('part 1:', solve(template, rules, 10));
  // 2768

  // ----------- part-2 -----------
  console.log('part 2:', solve(template, rules, 40));
  // 2914365137499
}

main();