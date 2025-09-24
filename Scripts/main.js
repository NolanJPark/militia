// main.js
Hooks.once("init", () => {
  console.log("Minimax Module | Initializing");
});

Hooks.on("getSceneControlButtons", (controls) => {
  // Add Militia Tools group to the left toolbar
  controls.push({
    name: "militia-tools",
    title: "Militia Tools",
    icon: "fas fa-chess",
    layer: "tokens", // uses the token layer
    tools: [
      {
        name: "friendly",
        title: "Friendly Move",
        icon: "fas fa-shield-alt",
        onClick: async () => {
          const module = await import("./friendly.js");
          module.buildFriendlyGrid();
        },
        button: true
      },
      {
        name: "hostile",
        title: "Hostile Move",
        icon: "fas fa-skull-crossbones",
        onClick: async () => {
          const module = await import("./hostile.js");
          module.buildHostileGrid();
        },
        button: true
      }
    ]
  });
});
