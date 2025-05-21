<<<<<<< HEAD
import { User } from "./userClass";
function runTests() {
    // Initialize a grid of 10x10 and a new User
    const user = new User(10, 10);
    // Test initial values
    console.log("Initial User Money:", user.userMoney);
    console.log("Initial Population:", user.totalPopulation);
    console.log("Initial Pollution:", user.totalPollution);
    console.log("Initial Time:", user.currentTime);
    // Test building a facility: PowerPlant
    const buildPPResult = user.buildPP(2, 2); // Try building PowerPlant at (2, 2)
    console.log("Building PowerPlant (2, 2):", buildPPResult);
    console.log("Buildings Built After PP:", user.buildingsBuilt);
    console.log("Remaining User Money After PP:", user.userMoney);
    // Test building a Factory
    const buildFactoryResult = user.buildFactory(3, 3); // Try building Factory at (3, 3)
    console.log("Building Factory (3, 3):", buildFactoryResult);
    console.log("Buildings Built After Factory:", user.buildingsBuilt);
    // Test power balance before monthly update
    console.log("Power Balance Before Monthly Update:", user.powerBalance);
    // Test building an Environmental Facility
    const buildEnvResult = user.buildEnvFacility(4, 4);
    console.log("Building Environmental Facility (4, 4):", buildEnvResult);
    console.log("Total Pollution After Env Facility:", user.totalPollution);
    // Test monthly updates: this should calculate revenues, update population, and pollution, etc.
    user.calculateMonthlyUpdates();
    console.log("User Money After Monthly Update:", user.userMoney);
    console.log("Total Population After Monthly Update:", user.totalPopulation);
    console.log("Total Pollution After Monthly Update:", user.totalPollution);
    console.log("Power Balance After Monthly Update:", user.powerBalance);
    console.log("Is Game Over:", user.isGameOver);
    // Test adding a Residence
    const buildResidenceResult = user.buildLuxury(5, 5);
    console.log("Building Luxury Residence (5, 5):", buildResidenceResult);
    // Test getting all facilities
    const allFacilities = user.getAllFacilities();
    console.log("All Facilities After Building:", allFacilities);
    // Test score calculation
    const score = user.calculateScore();
    console.log("User Score:", score);
    // Test canAfford method
    const canAffordPP = user.canAfford(500000000);
    console.log("Can afford PowerPlant:", canAffordPP);
    // Test grid functionality: Checking facilities at coordinates (2, 2)
    const facilityAt22 = user.getFacilityAt(2, 2);
    console.log("Facility at (2, 2):", facilityAt22);
    // Test building in an already occupied location
    const buildPPFail = user.buildPP(2, 2); // Try to build on an already occupied spot
    console.log("Try to Build PP on (2, 2) Again:", buildPPFail);
    console.log(user.grid);
=======
"use strict";
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
if (!canvas || !context) {
    throw new Error("Failed to get canvas or context");
>>>>>>> User
}
// Set up canvas dimensions
canvas.width = window.innerWidth - 220; // Leave space for toolbox
canvas.height = window.innerHeight - 20;
canvas.style.border = "5px solid #333";
canvas.style.marginLeft = "200px";
// Create toolbox container
const toolbox = document.createElement("div");
toolbox.style.position = "absolute";
toolbox.style.left = "10px";
toolbox.style.top = "10px";
toolbox.style.width = "180px";
toolbox.style.height = `${canvas.height}px`;
toolbox.style.border = "2px solid #333";
toolbox.style.padding = "10px";
toolbox.style.backgroundColor = "#f0f0f0";
toolbox.style.boxSizing = "border-box";
document.body.appendChild(toolbox);
// Create a canvas for the toolbox shapes
const toolboxCanvas = document.createElement("canvas");
toolboxCanvas.width = 160;
toolboxCanvas.height = canvas.height - 20;
toolboxCanvas.style.display = "block";
toolboxCanvas.style.margin = "0 auto";
toolbox.appendChild(toolboxCanvas);
let shapes = [];
let nextId = 1;
// Create toolbox shapes
const toolboxShapes = [
    { type: "rectangle", color: "#ff5252" },
    { type: "circle", color: "#4caf50" },
    { type: "triangle", color: "#2196f3" }
];
// Add shapes to toolbox
toolboxShapes.forEach((shapeDef, index) => {
    const shape = {
        id: nextId++,
        type: shapeDef.type,
        x: 20,
        y: 20 + index * 120,
        width: 100,
        height: 100,
        color: shapeDef.color,
        isDragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
        isInToolbox: true
    };
    shapes.push(shape);
    // Add label to toolbox
    const label = document.createElement("div");
    label.textContent = `${shapeDef.type}`;
    label.style.marginTop = `${shape.y + 110}px`;
    label.style.textAlign = "center";
    toolbox.appendChild(label);
});
// Canvas shapes (initially empty)
let activeShape = null;
function draw_shapes() {
    if (!context)
        return;
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Draw all shapes not in toolbox
    shapes.filter(shape => !shape.isInToolbox).forEach(shape => {
        if (context == null)
            return;
        context.fillStyle = shape.color;
        switch (shape.type) {
            case "rectangle":
                context.fillRect(shape.x, shape.y, shape.width, shape.height);
                break;
            case "circle":
                context.beginPath();
                context.arc(shape.x + shape.width / 2, shape.y + shape.height / 2, shape.width / 2, 0, Math.PI * 2);
                context.fill();
                break;
            case "triangle":
                context.beginPath();
                context.moveTo(shape.x + shape.width / 2, shape.y);
                context.lineTo(shape.x, shape.y + shape.height);
                context.lineTo(shape.x + shape.width, shape.y + shape.height);
                context.closePath();
                context.fill();
                break;
        }
    });
    // Draw toolbox shapes
    const toolboxCtx = toolboxCanvas.getContext("2d");
    if (!toolboxCtx)
        return;
    toolboxCtx.clearRect(0, 0, toolboxCanvas.width, toolboxCanvas.height);
    shapes.filter(shape => shape.isInToolbox).forEach(shape => {
        toolboxCtx.fillStyle = shape.color;
        switch (shape.type) {
            case "rectangle":
                toolboxCtx.fillRect(shape.x, shape.y, shape.width, shape.height);
                break;
            case "circle":
                toolboxCtx.beginPath();
                toolboxCtx.arc(shape.x + shape.width / 2, shape.y + shape.height / 2, shape.width / 2, 0, Math.PI * 2);
                toolboxCtx.fill();
                break;
            case "triangle":
                toolboxCtx.beginPath();
                toolboxCtx.moveTo(shape.x + shape.width / 2, shape.y);
                toolboxCtx.lineTo(shape.x, shape.y + shape.height);
                toolboxCtx.lineTo(shape.x + shape.width, shape.y + shape.height);
                toolboxCtx.closePath();
                toolboxCtx.fill();
                break;
        }
    });
}
function isPointInShape(x, y, shape) {
    switch (shape.type) {
        case "rectangle":
            return x >= shape.x && x <= shape.x + shape.width &&
                y >= shape.y && y <= shape.y + shape.height;
        case "circle":
            const centerX = shape.x + shape.width / 2;
            const centerY = shape.y + shape.height / 2;
            const radius = shape.width / 2;
            return Math.sqrt(Math.pow((x - centerX), 2) + Math.pow((y - centerY), 2)) <= radius;
        case "triangle":
            // Simple triangle hit test (for equilateral triangle)
            return y >= shape.y &&
                y <= shape.y + shape.height &&
                x >= shape.x + (y - shape.y) * (shape.width / 2) / shape.height &&
                x <= shape.x + shape.width - (y - shape.y) * (shape.width / 2) / shape.height;
        default:
            return false;
    }
}
// Mouse event handlers
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    // Check if clicking on a shape on canvas
    for (let shape of shapes.filter(s => !s.isInToolbox)) {
        if (isPointInShape(mouseX, mouseY, shape)) {
            activeShape = shape;
            activeShape.isDragging = true;
            activeShape.dragOffsetX = mouseX - shape.x;
            activeShape.dragOffsetY = mouseY - shape.y;
            break;
        }
    }
});
toolboxCanvas.addEventListener('mousedown', (e) => {
    const rect = toolboxCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    // Check if clicking on a shape in toolbox
    for (let shape of shapes.filter(s => s.isInToolbox)) {
        if (isPointInShape(mouseX, mouseY, shape)) {
            // Create a copy of the shape for the canvas
            const newShape = Object.assign(Object.assign({}, shape), { id: nextId++, x: 50, y: 50, isDragging: true, isInToolbox: false, dragOffsetX: 25, dragOffsetY: 25 // Center offset
             });
            shapes.push(newShape);
            activeShape = newShape;
            break;
        }
    }
});
document.addEventListener('mousemove', (e) => {
    if (!activeShape)
        return;
    const rect = activeShape.isInToolbox ? toolbox.getBoundingClientRect() : canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    if (activeShape.isDragging) {
        activeShape.x = mouseX - activeShape.dragOffsetX;
        activeShape.y = mouseY - activeShape.dragOffsetY;
        draw_shapes();
    }
});
document.addEventListener('mouseup', () => {
    if (activeShape) {
        activeShape.isDragging = false;
        // If shape was dragged from toolbox to outside toolbox, keep it
        if (activeShape.isInToolbox) {
            // Remove the shape if it wasn't moved to canvas
            const index = shapes.findIndex(s => s.id === activeShape.id);
            if (index !== -1 &&
                (activeShape.x < 0 || activeShape.x > canvas.width ||
                    activeShape.y < 0 || activeShape.y > canvas.height)) {
                shapes.splice(index, 1);
            }
        }
        activeShape = null;
    }
    draw_shapes();
});
// Initial draw
draw_shapes();
// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth - 220;
    canvas.height = window.innerHeight - 20;
    toolbox.style.height = `${canvas.height}px`;
    draw_shapes();
});
//# sourceMappingURL=test.js.map