// src/utils/MapBuilder.js
export default class MapBuilder {
  // Returns a 2D array representing the level layout.
  // 0 = floor, 1 = wall, 2 = artifact, 3 = exit, 4 = player start, 5 = enemy
  static getMap() {
    // Maze dimensions (must be odd for proper maze generation)
    const rows = 15;
    const cols = 21;

    // Initialize all cells as walls
    const map = [];
    for (let y = 0; y < rows; y++) {
      const row = [];
      for (let x = 0; x < cols; x++) {
        row.push(1); // wall
      }
      map.push(row);
    }

    // Recursive backtracker maze generation
    // Works on odd-numbered cells as "rooms", even ones as "walls between rooms"
    const visited = new Set();

    function cellKey(r, c) {
      return `${r},${c}`;
    }

    function carve(r, c) {
      visited.add(cellKey(r, c));
      map[r][c] = 0;

      // Directions: [dy, dx]
      const dirs = [
        [-2, 0], [2, 0], [0, -2], [0, 2]
      ];
      // Shuffle
      for (let i = dirs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
      }

      for (const [dy, dx] of dirs) {
        const nr = r + dy;
        const nc = c + dx;
        if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && !visited.has(cellKey(nr, nc))) {
          // Carve the wall between
          map[r + dy / 2][c + dx / 2] = 0;
          carve(nr, nc);
        }
      }
    }

    // Start carving from (1, 1)
    carve(1, 1);

    // Ensure border is all walls
    for (let y = 0; y < rows; y++) {
      map[y][0] = 1;
      map[y][cols - 1] = 1;
    }
    for (let x = 0; x < cols; x++) {
      map[0][x] = 1;
      map[rows - 1][x] = 1;
    }

    // Player start: top-left area
    map[1][1] = 4;

    // Exit: bottom-right area
    map[rows - 2][cols - 2] = 3;

    // Place artifacts on floor cells, spread around the maze
    const floorCells = [];
    for (let y = 1; y < rows - 1; y++) {
      for (let x = 1; x < cols - 1; x++) {
        if (map[y][x] === 0) {
          // Don't place too close to start
          const dist = Math.abs(y - 1) + Math.abs(x - 1);
          if (dist > 4) {
            floorCells.push([y, x]);
          }
        }
      }
    }

    // Shuffle and pick some for artifacts
    for (let i = floorCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [floorCells[i], floorCells[j]] = [floorCells[j], floorCells[i]];
    }

    const artifactCount = 5;
    for (let i = 0; i < Math.min(artifactCount, floorCells.length); i++) {
      const [ay, ax] = floorCells[i];
      map[ay][ax] = 2;
    }

    // Place enemies on remaining floor cells, spread out
    const remainingFloor = floorCells.slice(artifactCount);
    const enemyCount = 3;
    for (let i = 0; i < Math.min(enemyCount, remainingFloor.length); i++) {
      const [ey, ex] = remainingFloor[i];
      map[ey][ex] = 5;
    }

    return map;
  }
}
