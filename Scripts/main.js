// main.js
Hooks.once("init", () => {
  console.log("Militia Module | Initializing");
});

Hooks.on("getSceneControlButtons", (controls) => {
  controls.push({
    name: "militia-tools",
    title: "Militia Tools",
    icon: "fas fa-chess",
    layer: "controls",
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
