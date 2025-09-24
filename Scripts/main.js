// main.js - entry point of your Foundry module
import { buildGrid } from "./grid.js"; // optional if you separate logic

Hooks.once('init', function() {
  console.log("Minimax Module | Initializing");
  // Could register settings here if needed
});

Hooks.once('ready', function() {
  console.log("Minimax Module | Ready");

  // Add sidebar button under a category
  const categoryName = "Minimax Tools";

  // Check if the category exists, else create it
  let category = $(`.directory[data-tab="${categoryName}"]`);
  if (!category.length) {
    // Append category header
    $('#controls').append(`<div class="directory" data-tab="${categoryName}"><h3>${categoryName}</h3></div>`);
    category = $(`.directory[data-tab="${categoryName}"]`);
  }

  // Add the grid button
  const buttonHtml = `
    <a class="control-tool" title="Build Grid">
      <i class="fas fa-th"></i> Grid
    </a>
  `;
  const toolButton = $(buttonHtml).click(() => buildGrid());
  category.append(toolButton);

  console.log("Minimax Tools button added.");
});