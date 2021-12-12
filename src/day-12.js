const { clone, getInputAsArray, isLowerCase, isUpperCase } = require('./lib');

function parseGraph(rawInput) {
  const graph = {};

  for (const line of rawInput) {
    const [from, to] = line.split('-');

    graph[from] = graph[from] || [];
    graph[from].push(to);

    graph[to] = graph[to] || [];
    graph[to].push(from);
  }

  return graph;
}

function countPaths(graph, canVisit) {
  let count = 0;

  const stack = [];
  stack.push(['start', {}]);

  while (stack.length > 0) {
    let [node, visited] = stack.pop();
    if (!canVisit(node, visited)) continue;
    if (node === 'end') { count += 1; continue; }

    visited = clone(visited);
    visited[node] = (visited[node] || 0) + 1;

    for (const neighbor of graph[node]) {
      stack.push([neighbor, visited]);
    }
  }

  return count;
}

async function main() {
  const graph = await getInputAsArray().then(parseGraph);

  // ----------- part-1 -----------
  const part1 = countPaths(graph, (node, visited) => {
    return isUpperCase(node) || (visited[node] || 0) === 0;
  });

  console.log('part 1:', part1);
  // 5254

  // ----------- part-2 -----------
  const part2 = countPaths(graph, (node, visited) => {
    if (isUpperCase(node)) return true;
    if ((visited[node] || 0) === 0) return true;
    if (node === 'start') return false;
    if (Object.keys(visited).filter(isLowerCase).some(n => visited[n] === 2)) return false;
    return true;
  });

  console.log('part 2:', part2);
  // 149385
}

main();