"use strict";
// window.onload = () => {
//   const canvas = document.getElementById("gridCanvas") as HTMLCanvasElement | null;
//   if (!canvas) return;
//   const ctx = canvas.getContext("2d");
//   if (!ctx) return;
var _a;
//   const rows: number = 50;
//   const cols: number = 50;
//   const cellSize: number = canvas.width / cols;
//   ctx.strokeStyle = "#ccc";
//   for (let i = 0; i <= cols; i++) {
//     const x: number = i * cellSize;
//     ctx.beginPath();
//     ctx.moveTo(x, 0);
//     ctx.lineTo(x, canvas.height);
//     ctx.stroke();
//   }
//   for (let j = 0; j <= rows; j++) {
//     const y: number = j * cellSize;
//     ctx.beginPath();
//     ctx.moveTo(0, y);
//     ctx.lineTo(canvas.width, y);
//     ctx.stroke();
//   }
// };
const canvas = document.getElementById("gridCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const gridSize = 50;
const squareSize = ((_a = canvas === null || canvas === void 0 ? void 0 : canvas.width) !== null && _a !== void 0 ? _a : 0) / gridSize;
const grid = [];
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++)
        grid.push({
            x: i * squareSize,
            y: j * squareSize,
            color: "#ebebeb",
        });
}
function drawGrid() {
    if (!ctx)
        return;
    for (const square of grid) {
        ctx.fillStyle = square.color;
        ctx.strokeStyle = '#CCC';
        ctx.fillRect(square.x, square.y, squareSize, squareSize);
        ctx.strokeRect(square.x, square.y, squareSize, squareSize);
    }
}
function toggleSelected(clickedSquare) {
    clickedSquare.color = clickedSquare.color === "#ebebeb" ? "green" : "#ebebeb";
}
canvas === null || canvas === void 0 ? void 0 : canvas.addEventListener("click", function (event) {
    if (!canvas)
        return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const clickedSquare = grid.find((square) => mouseX >= square.x &&
        mouseX <= square.x + squareSize &&
        mouseY >= square.y &&
        mouseY <= square.y + squareSize);
    if (clickedSquare) {
        toggleSelected(clickedSquare);
    }
    drawGrid();
});
drawGrid();
const facilities = {
    essential: [
        { name: "Emergency Services", image: "police.png" },
        { name: "Education Centres", image: "school.png" },
        { name: "Medical Centres", image: "hospital.png" },
        { name: "Government", image: "government.png" },
        { name: "Power Plants", image: "powerplant.png" }
    ],
    residential: [
        { name: "Luxury Homes", image: "luxury.png" },
        { name: "Comfortable Homes", image: "comfortable.png" },
        { name: "Affordable Homes", image: "affordable.png" }
    ],
    industrial: [
        { name: "Factories", image: "factories.png" },
        { name: "Warehouses", image: "warehouses.png" },
        { name: "Environmental Facilities", image: "environmental.png" }
    ],
    commercial: [
        { name: "Stores", image: "store.png" },
        { name: "Restaurants", image: "restaurant.png" },
        { name: "Offices", image: "office.png" }
    ],
    defense: [
        { name: "Planetary Defense System", image: "shield.png" }
    ]
};
const typeButtons = document.querySelectorAll('.typeButton');
const selectorButtonContainer = document.querySelector('.selectorButtonContainer');
// Set dataset for each typeButton
typeButtons.forEach((btn, i) => {
    const types = ['essential', 'residential', 'industrial', 'commercial', 'defense'];
    btn.dataset.type = types[i];
});
typeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.dataset.type;
        typeButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        displayBuildings(type);
    });
});
function displayBuildings(type) {
    selectorButtonContainer.innerHTML = ''; // Clear existing buttons
    facilities[type].forEach(({ name, image }) => {
        const button = document.createElement('button');
        button.classList.add('selectorButton');
        const img = document.createElement('img');
        img.src = `./Imgs/${type}/${image}`;
        img.alt = name;
        img.title = name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        button.appendChild(img);
        selectorButtonContainer.appendChild(button);
    });
}
//# sourceMappingURL=user.js.map