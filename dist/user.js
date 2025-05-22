import { Planet } from "./planetClass.js";
// Instantiate planet
const planet = new Planet(50, 50);
const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");
const squareSize = 40; // Match the size used in your Planet/Grid logic
// Draw the initial empty grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y += squareSize) {
        for (let x = 0; x < canvas.width; x += squareSize) {
            ctx.strokeStyle = "#ccc";
            ctx.strokeRect(x, y, squareSize, squareSize);
        }
    }
    // Let Planet handle rendering facilities
    planet.draw();
}
// Handle canvas click
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / squareSize);
    const y = Math.floor((e.clientY - rect.top) / squareSize);
    console.log(`Clicked grid at (${x}, ${y})`);
    // Build a facility - replace with real selection logic
    const success = planet.buildFacility("essential", "Emergency Services", x, y);
    if (success) {
        drawGrid();
    }
    else {
        alert("Could not place building here.");
    }
});
// Initial draw
drawGrid();
//# sourceMappingURL=user.js.map