// grid.js
export async function buildGrid() {
  const scene = game.scenes.active;
  if (!scene) return ui.notifications.warn("No active scene found.");

  const w = Math.floor(scene.data.width / scene.data.grid);
  const h = Math.floor(scene.data.height / scene.data.grid);

  let grid = Array.from({ length: h }, () => Array(w).fill(0));

  for (let token of scene.data.tokens) {
    const x = Math.floor(token.x / scene.data.grid);
    const y = Math.floor(token.y / scene.data.grid);

    if (!token.actor) continue;
    const name = token.actor.name.toLowerCase();
    const disposition = token.data.disposition;

    if (token.data.barrier) {
      grid[y][x] = 1; // hazard
    } else if (token.actor.type === 'character') {
      grid[y][x] = 2; // player
    } else if (disposition === 1 && name.startsWith('militia')) {
      grid[y][x] = 4; // friendly NPC militia
    } else if (disposition === 1) {
      grid[y][x] = 3; // friendly NPC
    } else if (disposition === 3 && name.startsWith('militia')) {
      grid[y][x] = 6; // enemy NPC militia
    } else if (disposition === 3) {
      grid[y][x] = 5; // enemy NPC
    }
  }

  console.log("Grid built:", grid);

  // Print grid in chat
  const gridString = grid.map(row => row.join(" ")).join("\n");
  let chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    content: `<pre>${gridString}</pre>`
  };
  ChatMessage.create(chatData);

  ui.notifications.info("Grid built! Check chat or console for output.");
}
