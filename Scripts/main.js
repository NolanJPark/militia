Hooks.once("init", () => {
  console.log("Militia AI | Module initializing...");
});

Hooks.once("ready", () => {
  console.log("Militia AI | Module is ready!");
  ui.notifications.info("✅ Militia AI loaded successfully!");
});
