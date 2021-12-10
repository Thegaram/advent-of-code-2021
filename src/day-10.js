const { getInputAsArray } = require('./lib');

function validate(line) {
  const stack = [];

  for (const ch of line) {
    switch (ch) {
      // open chunk
      case '(': stack.push(')'); break;
      case '[': stack.push(']'); break;
      case '{': stack.push('}'); break;
      case '<': stack.push('>'); break;

      // close chunk
      default: if (ch != stack.pop()) return [false, ch];
    }
  }

  return [true, stack.reverse()];
}

async function main() {
  const input = await getInputAsArray();

  // ----------- part-1 -----------
  let score = 0;

  for (const line of input) {
    const [isValid, ch] = validate(line);
    if (isValid) continue;

    switch (ch) {
      case ')': score +=     3; break;
      case ']': score +=    57; break;
      case '}': score +=  1197; break;
      case '>': score += 25137; break;
      default: throw 'Unexpected character';
    }
  }

  console.log('part 1:', score);
  // 345441

  // ----------- part-2 -----------
  const scores = [];

  for (const line of input) {
    const [isValid, completion] = validate(line);
    if (!isValid) continue;
    scores.unshift(0);

    for (const ch of completion) {
      switch (ch) {
        case ')': scores[0] = 5 * scores[0] + 1; break;
        case ']': scores[0] = 5 * scores[0] + 2; break;
        case '}': scores[0] = 5 * scores[0] + 3; break;
        case '>': scores[0] = 5 * scores[0] + 4; break;
        default: throw 'Unexpected character';
      }
    }
  }

  scores.sort((a, b) => a - b);
  const middle = scores[Math.floor(scores.length / 2)];

  console.log('part 2:', middle);
  // 3235371166
}

main();