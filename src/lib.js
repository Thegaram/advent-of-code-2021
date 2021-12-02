const readline = require('readline');

function getInputAsArray() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin });
    const result = [];
    rl.on('line', line => result.push(line));
    rl.on('close', () => resolve(result));
  });
}

module.exports = {
  getInputAsArray,
};