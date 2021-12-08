const readline = require('readline');

function getInputAsArray() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin });
    const result = [];
    rl.on('line', line => result.push(line));
    rl.on('close', () => resolve(result));
  });
}

// source: https://stackoverflow.com/a/20871714
function permute(inputArr) {
  let result = [];

  const permuteInner = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permuteInner(curr.slice(), m.concat(next))
     }
   }
 }

 permuteInner(inputArr)

 return result;
}

module.exports = {
  getInputAsArray,
  permute,
};