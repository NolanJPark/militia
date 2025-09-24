// main.js
import { buildGrid } from "./grid.js";

Hooks.once("init", () => {
  console.log("Minimax Module | Initializing");
});

Hooks.on("getSceneControlButtons", (controls) => {
  // Add a new control group for Minimax
  controls.push({
    name: "minimax",
    title: "Minimax Tools",
    icon: "fas fa-chess",
    layer: "controls", // no custom canvas layer needed yet
    tools: [
      {
        name: "buildGrid",
        title: "Build Grid",
        icon: "fas fa-th",
        onClick: () => buildGrid(),
        button: true
      }
    ]
  });
});