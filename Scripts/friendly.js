import { buildGrid } from "./grid.js";

// --- Heuristic function ---
function evaluateState(grid) {
  let friendlies = 0, enemies = 0;

  for (let row of grid) {
    for (let cell of row) {
      if (cell === 4) friendlies++;
      if (cell === 5 || cell === 6) enemies++;
    }
  }

  if (enemies === 0) return 1000; // win
  if (friendlies === 0) return -1000; // loss

  // Basic heuristic: difference
  const diff = friendlies - enemies;
  return diff * 10;
}

// --- Directions (include diagonals) ---
const DIRECTIONS = [
  [1, 0], [-1, 0], [0, 1], [0, -1], // cardinal
  [1, 1], [1, -1], [-1, 1], [-1, -1] // diagonals
];

// --- Move generation (for friendly militia only) ---
function generateMoves(grid, isFriendly) {
  const moves = [];
  const targetValues = isFriendly ? [4] : [5, 6];
  const h = grid.length;
  const w = grid[0].length;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!targetValues.includes(grid[y][x])) continue;

      let queue = [{ x, y, dist: 0 }];
      let visited = new Set([`${x},${y}`]);

      while (queue.length > 0) {
        const { x: cx, y: cy, dist } = queue.shift();

        if (dist > 0 && grid[cy][cx] === 0) {
          moves.push({ from: { x, y }, to: { x: cx, y: cy } });
        }

        if (dist < 2) { // keep small radius while testing
          for (let [dx, dy] of DIRECTIONS) {
            const nx = cx + dx, ny = cy + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            if (visited.has(`${nx},${ny}`)) continue;
            if (grid[ny][nx] !== 0 && !(nx === x && ny === y)) continue; 
            visited.add(`${nx},${ny}`);
            queue.push({ x: nx, y: ny, dist: dist + 1 });
          }
        }
      }
    }
  }

  return moves;
}

// --- Apply a move and return new state ---
function applyMove(grid, move, isFriendly) {
  const newGrid = grid.map(row => [...row]);
  const { from, to } = move;

  const unitValue = isFriendly ? 4 : 5; // militia only
  newGrid[from.y][from.x] = 0; // vacate origin
  newGrid[to.y][to.x] = unitValue;

  // Kill check (enemy adjacent to destination, 8 directions)
  const enemyValues = isFriendly ? [5, 6] : [4];
  for (let [dx, dy] of DIRECTIONS) {
    const nx = to.x + dx, ny = to.y + dy;
    if (ny < 0 || ny >= newGrid.length || nx < 0 || nx >= newGrid[0].length) continue;
    if (enemyValues.includes(newGrid[ny][nx])) {
      newGrid[ny][nx] = 0; // kill
    }
  }

  return newGrid;
}

// --- Minimax with alpha-beta ---
function minimax(grid, depth, alpha, beta, isFriendly) {
  if (depth === 0) return evaluateState(grid);

  const moves = generateMoves(grid, isFriendly);
  if (moves.length === 0) return evaluateState(grid);

  if (isFriendly) {
    let maxEval = -Infinity;
    for (let move of moves) {
      const evalScore = minimax(applyMove(grid, move, true), depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let move of moves) {
      const evalScore = minimax(applyMove(grid, move, false), depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// --- Find best move for friendly side ---
function findBestFriendlyMove(grid, depth = 3) {
  let bestMove = null;
  let bestScore = -Infinity;

  const moves = generateMoves(grid, true);
  for (let move of moves) {
    const newGrid = applyMove(grid, move, true);
    const score = minimax(newGrid, depth - 1, -Infinity, Infinity, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = { move, newGrid };
    }
  }

  return { bestMove, bestScore };
}

// --- Entry point for Friendly button ---
export async function buildFriendlyGrid() {
  const grid = await buildGrid();
  if (!grid) return;

  const { bestMove, bestScore } = findBestFriendlyMove(grid, 3);
  if (bestMove) {
    console.log("Best Friendly Move:", bestMove.move);
    console.log("Best Friendly Score:", bestScore);
    console.table(bestMove.newGrid);
  } else {
    console.log("No valid friendly moves.");
  }

  ui.notifications.info("Friendly minimax run complete (see console for best move grid).");
}
