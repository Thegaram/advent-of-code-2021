const { clone, getInputAsArray } = require('./lib');

function exists(node) {
  return typeof node !== 'undefined';
}

function isPair(node) {
  return exists(node) && exists(node.lhs) && exists(node.rhs);
}

function isNumber(node) {
  return exists(node) && exists(node.val);
}

function parse(raw, ptr = 0) {
  if (raw[ptr] === '[') {
    let lhs, rhs;
    [lhs, ptr] = parse(raw, ptr + 1); // skip '['
    [rhs, ptr] = parse(raw, ptr + 1); // skip ','
    return [{ lhs, rhs }, ptr + 1];   // skip ']'
  }

  return [{ val: Number(raw[ptr]) }, ptr + 1];
}

function print(node) {
  if (isNumber(node)) {
    process.stdout.write(`${node.val}`);
  }

  else if (isPair(node)) {
    process.stdout.write('[');
    print(node.lhs);
    process.stdout.write(',');
    print(node.rhs);
    process.stdout.write(']');
  }
}

function explode(tree) {
  const stack = [[tree, 0]];

  let found = false;
  let left, right, pair;

  while (stack.length > 0) {
    const [node, depth] = stack.pop();
    if (!exists(node)) continue;
    if (!found && isNumber(node)) left = node;
    if (found && isNumber(node) && !right) { right = node; break; }
    if (!found && depth === 4 && isPair(node)) { pair = node; found = true; continue; }
    stack.push([node.rhs, depth + 1]);
    stack.push([node.lhs, depth + 1]);
  }

  if (found) {
    if (left) left.val += pair.lhs.val;
    if (right) right.val += pair.rhs.val;
    pair.val = 0;
    delete pair.lhs;
    delete pair.rhs;
    return true;
  }

  return false;
}

function split(tree) {
  const stack = [tree];

  while (stack.length > 0) {
    const node = stack.pop();
    if (!exists(node)) continue;

    if ((node.val || 0) >= 10) {
      node.lhs = { val: Math.floor(node.val / 2) };
      node.rhs = { val: Math.ceil(node.val / 2) };
      delete node.val;
      return true;
    }

    stack.push(node.rhs);
    stack.push(node.lhs);
  }

  return false;
}

function reduceOnce(tree) {
  if (explode(tree)) return true;
  if (split(tree)) return true;
  return false;
}

function reduce(tree) {
  while (reduceOnce(tree)) {}
}

function add(lhs, rhs) {
  const tree = clone({ lhs, rhs });
  reduce(tree);
  return tree;
}

function magnitude(node) {
  if (isNumber(node)) return node.val;
  if (isPair(node)) return 3 * magnitude(node.lhs) + 2 * magnitude(node.rhs);
}

async function main() {
  const list = (await getInputAsArray()).map(_ => parse(_)[0]);

  // ----------- part-1 -----------
  const sum = list.reduce(add);
  console.log('part 1:', magnitude(sum));
  // 4202

  // ----------- part-2 -----------
  let max = 0;

  for(let ii = 0; ii < list.length - 1; ++ii) {
    for (let jj = ii + 1; jj < list.length; ++jj) {
      const m1 = magnitude(add(list[ii], list[jj]));
      const m2 = magnitude(add(list[jj], list[ii]));
      if (m1 > max) max = m1;
      if (m2 > max) max = m2;
    }
  }

  console.log('part 2:', max);
  // 4779
}

main();