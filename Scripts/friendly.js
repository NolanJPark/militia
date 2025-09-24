import { buildGrid } from "./grid.js";

export async function buildFriendlyGrid() {
  const grid = await buildGrid();
  if (!grid) return;

  // Example: mark friendly side numbers if needed (currently handled in grid.js)
  // You can adjust numbers here for minimax scoring later

  console.log("Friendly side grid:", grid);
  ui.notifications.info("Friendly grid generated. Check console for output.");
}
