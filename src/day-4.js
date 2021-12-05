const { getInputAsArray } = require('./lib');

async function main() {
  let [numbers, ...rows] = (await getInputAsArray()).filter(line => line != '');
  numbers = numbers.split(',')
  rows = rows.map(row => row.replace(/^\s+/,"").split(/\s+/).map(n => [n, false]));

  const hasWon = new Set();
  const leaderboard = [];

  for (const n of numbers) {
    rows = rows.map(row => row.map(([m, marked]) => [m, marked || m === n]));
    let winners = [];

    findWinner: for (let candidate = 0; candidate < rows.length / 5; ++candidate) {
      if (hasWon.has(candidate)) continue;

      // ready row
      for (let row = 0; row < 5; ++row) {
        if (rows[row + candidate * 5].every(([_, marked]) => marked)) {
          winners.push(candidate);
          hasWon.add(candidate);
          continue findWinner;
        }
      }

      // ready col
      for (let col = 0; col < 5; ++col) {
        if ([0, 1, 2, 3, 4].every(row => rows[row + candidate * 5][col][1])) {
          winners.push(candidate);
          hasWon.add(candidate);
          continue findWinner;
        }
      }
    }

    for (let board of winners) {
      let sum = 0;

      for (let row = 0; row < 5; ++row) {
        for (let col = 0; col < 5; col++) {
          if (rows[row + board * 5][col][1] === false) {
            sum += Number(rows[row + board * 5][col][0]);
          }
        }
      }

      leaderboard.push([board, sum * Number(n)])
    }
  }

  console.log('part 1:', leaderboard[0]);
  // 35670

  console.log('part 2:', leaderboard[leaderboard.length - 1]);
  // 22704
}

main();