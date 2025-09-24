import { buildGrid } from "./grid.js";

export async function buildHostileGrid() {
  const grid = await buildGrid();
  if (!grid) return;

  // Example: mark hostile side numbers if needed (currently handled in grid.js)
  // You can adjust numbers here for minimax scoring later

  console.log("Hostile side grid:", grid);
  ui.notifications.info("Hostile grid generated. Check console for output.");
}
