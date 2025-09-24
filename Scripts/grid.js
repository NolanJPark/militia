// grid.js
export async function buildGrid() {
  const scene = canvas.scene;
  if (!scene) return ui.notifications.warn("No active scene found.");

  const w = Math.floor(scene.width / scene.grid.size);
  const h = Math.floor(scene.height / scene.grid.size);

  let grid = Array.from({ length: h }, () => Array(w).fill(0));

  // Iterate over TokenDocuments in the scene
  for (let token of scene.tokens) {
    const x = Math.floor(token.x / scene.grid.size);
    const y = Math.floor(token.y / scene.grid.size);

    if (!token.actor) continue;
    const name = token.actor.name?.toLowerCase() ?? "";
    const disposition = token.disposition;  // ✅ works on TokenDocument in v11

    // Fill grid according to your rules
    if (token.flags?.hazard) {
      grid[y][x] = 1; // hazard
    } else if (token.actor.type === "character") {
      grid[y][x] = 2; // player
    } else if (disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY && name.startsWith("militia")) {
      grid[y][x] = 4; // friendly NPC militia
    } else if (disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY) {
      grid[y][x] = 3; // friendly NPC
    } else if (disposition === CONST.TOKEN_DISPOSITIONS.HOSTILE && name.startsWith("militia")) {
      grid[y][x] = 6; // enemy NPC militia
    } else if (disposition === CONST.TOKEN_DISPOSITIONS.HOSTILE) {
      grid[y][x] = 5; // enemy NPC
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
