// grid.js
export async function buildGrid() {
  const scene = canvas.scene; // ✅ use canvas.scene instead of game.scenes.active
  if (!scene) return ui.notifications.warn("No active scene found.");

  const w = Math.floor(scene.width / scene.grid.size);
  const h = Math.floor(scene.height / scene.grid.size);

  let grid = Array.from({ length: h }, () => Array(w).fill(0));

  for (let token of scene.tokens) {  // ✅ canvas.scene.tokens is already iterable
    const x = Math.floor(token.x / scene.grid.size);
    const y = Math.floor(token.y / scene.grid.size);

    if (!token.actor) continue;
    const name = token.actor.name.toLowerCase();
    const disposition = token.document.disposition; // ✅ use document API

    // Example hazard check (adapt to your system!)
    if (token.document.flags?.hazard) {
      grid[y][x] = 1; // hazard
    } else if (token.actor.type === "character") {
      grid[y][x] = 2; // player
    } else if (disposition === 1 && name.startsWith("militia")) {
      grid[y][x] = 4; // friendly NPC militia
    } else if (disposition === 1) {
      grid[y][x] = 3; // friendly NPC
    } else if (disposition === -1 && name.startsWith("militia")) {
      grid[y][x] = 6; // enemy NPC militia
    } else if (disposition === -1) {
      grid[y][x] = 5; // enemy NPC
    }
  }

  console.log("Grid built:", grid);

  // Print grid in chat
  const gridString = grid.map(row => row.join(" ")).join("\n");
  ChatMessage.create({
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    content: `<pre>${gridString}</pre>`
  });

  ui.notifications.info("Grid built! Check chat or console for output.");
}