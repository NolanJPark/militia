// main.js
Hooks.once("init", () => {
  console.log("Minimax Module | Initializing");
});

Hooks.on("getSceneControlButtons", (controls) => {
  controls.push({
    name: "militia-tools",
    title: "Militia Tools",
    icon: "fas fa-chess",
    layer: "none", // dummy layer, prevents Foundry from switching tools
    tools: [
      {
        name: "friendly",
        title: "Friendly Move",
        icon: "fas fa-shield-alt",
        onClick: async () => {
          const module = await import("./friendly.js");
          module.buildFriendlyGrid();
        },
        button: true,
        toggle: false // prevent Foundry from trying to toggle layers
      },
      {
        name: "hostile",
        title: "Hostile Move",
        icon: "fas fa-skull-crossbones",
        onClick: async () => {
          const module = await import("./hostile.js");
          module.buildHostileGrid();
        },
        button: true,
        toggle: false
      }
    ]
  });
});
