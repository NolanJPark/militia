// grid.js
export async function buildGrid() {
  const scene = canvas.scene;
  if (!scene) return ui.notifications.warn("No active scene found.");

  const w = Math.floor(scene.width / scene.grid.size);
  const h = Math.floor(scene.height / scene.grid.size);

  let grid = Array.from({ length: h }, () => Array(w).fill(0));

  for (let token of scene.tokens) {
    if (!token.actor) continue;

    const name = token.actor.name?.toLowerCase() ?? "";
    const disposition = token.disposition;
    const isPlayer = token.actor.type === "character";

    // figure out which grid squares it covers
    const startX = Math.floor(token.x / scene.grid.size);
    const startY = Math.floor(token.y / scene.grid.size);
    const width = token.width;   // in grid units
    const height = token.height; // in grid units

    // Determine what value this token would write
    let value = 0;
    if (token.flags?.hazard) {
      value = 1;
    } else if (isPlayer) {
      value = 2;
    } else if (disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY && name.startsWith("militia")) {
      value = 4;
    } else if (disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY) {
      value = 3;
    } else if (disposition === CONST.TOKEN_DISPOSITIONS.HOSTILE && name.startsWith("militia")) {
      value = 6;
    } else if (disposition === CONST.TOKEN_DISPOSITIONS.HOSTILE) {
      value = 5;
    }

    // Fill all grid squares this token occupies
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        const gx = startX + dx;
        const gy = startY + dy;
        if (gx < 0 || gy < 0 || gx >= w || gy >= h) continue;

        // Special case: players override everything else
        if (grid[gy][gx] === 2 && !isPlayer) continue;
        if (isPlayer) {
          grid[gy][gx] = 2;
        } else {
          grid[gy][gx] = value;
        }
      }
    }
  }

  console.log("Grid built:", grid);

  // Print in chat
  const gridString = grid.map(row => row.join(" ")).join("\n");
  ChatMessage.create({
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    content: `<pre>${gridString}</pre>`
  });

  ui.notifications.info("Grid built! Check chat or console for output.");
}
