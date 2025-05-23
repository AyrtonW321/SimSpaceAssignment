
// class imports
import { Planet } from "./planetClass.js";
import { Facility } from "./facilityClass.js";

// initialize the user
const USER = new Planet(50, 50);

// variables for rows and columns of the grid
const ROWS = USER.grid.rows; 
const COLS = USER.grid.columns;

// canvas setup
const canvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// canvas hover variables
let hoverRow: number | null = null;
let hoverCol: number | null = null;
let isMouseInCanvas = false;

// currently selected building
let currentSelectedBuilding: string | null = null;

// building category colours
const buildingColours: { [key: string]: string } = {
    essential: "#4CAF50",
    residential: "#FFC107",
    industrial: "#F44336",
    commercial: "#9C27B0",
    defense: "#2196F3",
};

// building images
const buildingImages: { [key: string]: string } = {
    EmergencyServices: "police.png",
    EducationCenter: "school.png",
    MedicalCenter: "hospital.png",
    GovernmentFacility: "government.png",
    PowerPlant: "powerplant.png",
    LuxuryResidence: "luxury.png",
    ComfortableResidence: "comfortable.png",
    AffordableResidence: "affordable.png",
    Factory: "factory.png",
    EnvironmentalFacility: "environmental.png",
    Warehouse: "warehouse.png",
    Store: "store.png",
    Restaurant: "restaurant.png",
    Office: "office.png",
    PlanetaryDefense: "shield.png",
};

// canvas setup
function setupCanvas() {
    // use only 90% of the given space, looks less crowded
    const size = Math.min(window.innerWidth * 0.87, window.innerHeight * 0.87);
    canvas.width = size;
    canvas.height = size;
}

// draw the grid
function drawGrid() {
    // constants for the canvas width and height
    const cellWidth = canvas.width / COLS;
    const cellHeight = canvas.height / ROWS;

    // cleaer the grid
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw canvas lines
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;

    // vertical lines
    for (let col = 0; col <= COLS; col++) {
        const x = col * cellWidth;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // horizontal lines
    for (let row = 0; row <= ROWS; row++) {
        const y = row * cellHeight;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // draw facilities, if there are any
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const facility = USER.grid.getFacility(row, col);
            if (facility) {
                drawFacility(facility, row, col, cellWidth, cellHeight);
            }
        }
    }

    // draw the hover highlights if there is
    drawHoverHighlight();

    // update the stats
    updateStatsUI();
}

// draw the facility in the cell
function drawFacility(
    facility: Facility,
    row: number,
    col: number,
    width: number,
    height: number
) {
    // get the facility in the grid
    const gridFacility = USER.grid.getFacility(row, col);

    // if the facility in the grid is null, or is not a facility that was mentioned, return
    if (!gridFacility || gridFacility !== facility) return;

    // variables for the x and y size of the grid
    const x = col * width;
    const y = row * height;

    // get the facility cadegory and colour
    let category = "essential";
    if (facility.typeOf.includes("Residence")) category = "residential";
    else if (
        facility.typeOf.includes("Factory") ||
        facility.typeOf.includes("Environmental") ||
        facility.typeOf.includes("Warehouse")
    )
        category = "industrial";
    else if (
        facility.typeOf.includes("Store") ||
        facility.typeOf.includes("Restaurant") ||
        facility.typeOf.includes("Office")
    )
        category = "commercial";
    else if (facility.typeOf.includes("PlanetaryDefense")) category = "defense";

    // draw its background colour accordingly
    ctx.fillStyle = buildingColours[category];
    ctx.fillRect(x, y, width, height);

    // get a clean name for the facility, reduces possible errors
    const typeName = facility.typeOf.replace(/[()]/g, "").split(" ")[0];

    // draw the facility image
    const img = new Image();
    img.src = `./Imgs/${category}/${buildingImages[typeName]}`;

    // draws with image.onload to pervent the image not being drawn
    img.onload = () => {
        // center the image in the cell
        const imgSize = Math.min(width, height) * 0.8;
        const imgX = x + (width - imgSize) / 2;
        const imgY = y + (height - imgSize) / 2;
        ctx.drawImage(img, imgX, imgY, imgSize, imgSize);

        // redraw border after the image loads
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, width, height);
    };
}

// draw the on-hover highlight
function drawHoverHighlight() {
    // contuine only if the box is actually present and the mouse is in canvas
    if (hoverRow !== null && hoverCol !== null && isMouseInCanvas) {
        const cellWidth = canvas.width / COLS;
        const cellHeight = canvas.height / ROWS;
        const x = hoverCol * cellWidth;
        const y = hoverRow * cellHeight;

        // yellow highlight colour
        ctx.strokeStyle = "#FFFF00";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
    }
}

// initialize the building for the html
function initializeBuildingMenu() {
    // a toggle for the buidling dropdown
    document.querySelectorAll(".building-type h3").forEach((header) => {
        header.addEventListener("click", () => {
            header.classList.toggle("expanded");
            const options = header.nextElementSibling as HTMLElement;
            options.classList.toggle("expanded");
        });
    });

    // building selection
    document.querySelectorAll(".building-option").forEach((option) => {
        option.addEventListener("click", function (this: HTMLElement) {
            // removes the previous selection
            document.querySelectorAll(".building-option").forEach((opt) => {
                (opt as HTMLElement).style.backgroundColor = "";
            });

            // highlight the selected building
            this.style.backgroundColor = "#5d7fa3";

            // store the selected building
            currentSelectedBuilding = this.getAttribute("data-type");

            // lgos the building (debugging purposes)
            console.log("Selected building:", currentSelectedBuilding);
        });
    });
}

// waits for a click on the canvas
canvas.addEventListener("click", (event: MouseEvent) => {
    // if a building isn't selected, returns and alerts
    if (!currentSelectedBuilding) {
        alert("Please select a building type first");
        return;
    }

    // get the location for the currently selected rectangle
    const rect = canvas.getBoundingClientRect();
    // constants for the mouse location, relative to the users screen
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // constants for the actual row and column of the selected 
    const col = Math.floor(mouseX / (canvas.width / COLS));
    const row = Math.floor(mouseY / (canvas.height / ROWS));

    // Place the selected building using Planet's build methods
    placeBuilding(currentSelectedBuilding, row, col);
});

// waits for a mouse move on the canvas
canvas.addEventListener("mousemove", (event: MouseEvent) => {
    // get the location for the currently selected rectangle
    const rect = canvas.getBoundingClientRect();

    // constants for the mouse location, relative to the users screen
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // constant for the mouse location relative to the users screen
    hoverCol = Math.floor(mouseX / (canvas.width / COLS));
    hoverRow = Math.floor(mouseY / (canvas.height / ROWS));

    // Redraw to show the hover effect
    drawGrid();
});

// waits for the mouse to be in the canvas
canvas.addEventListener("mouseenter", () => {
    isMouseInCanvas = true;
    // redraw the grid to have the box highlighted showing
    drawGrid(); 
});

// waits for the mouse to leave the canvas
canvas.addEventListener("mouseleave", () => {
    isMouseInCanvas = false;
    hoverRow = null;
    hoverCol = null;

    // redraw the grid 
    drawGrid();
});

function placeBuilding(buildingType: string, row: number, col: number) {
    let success = false;

    // Use Planet's specific build methods
    switch (buildingType) {
        case "emergency":
            success = USER.buildEmergencyServ(row, col);
            break;
        case "education":
            success = USER.buildEduCenter(row, col);
            break;
        case "medical":
            success = USER.buildMedCenter(row, col);
            break;
        case "government":
            success = USER.buildGovernment(row, col);
            break;
        case "power":
            success = USER.buildPP(row, col);
            break;
        case "luxury":
            success = USER.buildLuxury(row, col);
            break;
        case "comfortable":
            success = USER.buildComfort(row, col);
            break;
        case "affordable":
            success = USER.buildAffordable(row, col);
            break;
        case "factory":
            success = USER.buildFactory(row, col);
            break;
        case "environmental":
            success = USER.buildEnvFacility(row, col);
            break;
        case "warehouse":
            success = USER.buildWarehouse(row, col);
            break;
        case "store":
            success = USER.buildStore(row, col);
            break;
        case "restaurant":
            success = USER.buildRestaurant(row, col);
            break;
        case "office":
            success = USER.buildOffice(row, col);
            break;
        case "shield":
            success = USER.buildPlanetaryDefense(row, col);
            break;
        default:
            console.error("Unknown building type:", buildingType);
            return;
    }

    if (success) {
        drawGrid(); // Redraw the grid with the new building
    } else {
        // Check why placement failed
        if (USER.grid.getFacility(row, col) !== null) {
            alert("There's already a building here!");
            console.log(USER.grid);
        } else {
            alert("Couldn't place building here (other restriction)");
        }
    }
}

function updateStatsUI() {
    // Get DOM elements
    const buildingsStat = document.getElementById("buildings-stat")!;
    const moneyStat = document.getElementById("money-stat")!;
    const timeStat = document.getElementById("time-stat")!;
    const populationStat = document.getElementById("population-stat")!;
    const pollutionStat = document.getElementById("pollution-stat")!;
    const powerGenStat = document.getElementById("power-gen-stat")!;
    const powerUsedStat = document.getElementById("power-used-stat")!;
    const powerBalanceStat = document.getElementById("power-balance-stat")!;
    const scoreStat = document.getElementById("score-stat")!;

    // Update stats
    buildingsStat.textContent = `${USER.buildingsBuilt}/${USER.maxBuildings}`;
    moneyStat.textContent = `$${USER.userMoney.toLocaleString()}`;
    timeStat.textContent = `Month ${USER.currentTime}`;
    populationStat.textContent = USER.totalPopulation.toLocaleString();
    pollutionStat.textContent = USER.totalPollution.toLocaleString();
    powerGenStat.textContent = USER.totalPowerGenerated.toLocaleString();
    powerUsedStat.textContent = USER.totalPowerUsed.toLocaleString();

    // Power balance with color coding
    const powerBalance = USER.powerBalance;
    powerBalanceStat.textContent = `${
        powerBalance >= 0 ? "+" : ""
    }${powerBalance.toLocaleString()}`;
    powerBalanceStat.className =
        powerBalance >= 0 ? "stat-value positive" : "stat-value negative";

    scoreStat.textContent = USER.calculateScore().toLocaleString();
}

// Add this to your initialization code
function setupStatsToggle() {
    const statsHeader = document.getElementById("stats-header")!;
    const statsContent = document.getElementById("stats-content")!;

    statsHeader.addEventListener("click", () => {
        statsContent.classList.toggle("collapsed");
        statsContent.classList.toggle("expanded");
    });
}

// Add these variables at the top with your other game state variables
let gameSpeed: 0 | 1 | 2 = 1; // 0 = paused, 1 = normal, 2 = fast
let gameLoopInterval: number;
const BASE_TICK_TIME = 10000; // 10 seconds per month (normal speed)

// Modify your game loop initialization
function startGameLoop() {
    clearInterval(gameLoopInterval); // Clear any existing loop
    
    if (gameSpeed === 0) return; // Don't start if paused
    
    const tickTime = gameSpeed === 2 ? BASE_TICK_TIME / 2 : BASE_TICK_TIME;
    gameLoopInterval = window.setInterval(() => {
        USER.calculateMonthlyUpdates();
        drawGrid();
        if (USER.isGameOver) clearInterval(gameLoopInterval);
    }, tickTime);
}

// Add these control functions
function setupGameControls() {
    const pauseBtn = document.getElementById('pause-btn')!;
    const playBtn = document.getElementById('play-btn')!;
    const fastForwardBtn = document.getElementById('fast-forward-btn')!;
    
    pauseBtn.addEventListener('click', () => {
        gameSpeed = 0;
        clearInterval(gameLoopInterval);
        updateControlButtons();
    });
    
    playBtn.addEventListener('click', () => {
        gameSpeed = 1;
        startGameLoop();
        updateControlButtons();
    });
    
    fastForwardBtn.addEventListener('click', () => {
        gameSpeed = 2;
        startGameLoop();
        updateControlButtons();
    });
}

function updateControlButtons() {
    const playBtn = document.getElementById('play-btn')!;
    const pauseBtn = document.getElementById('pause-btn')!;
    const fastForwardBtn = document.getElementById('fast-forward-btn')!;
    
    // Reset all buttons
    playBtn.classList.remove('active');
    pauseBtn.classList.remove('active');
    fastForwardBtn.classList.remove('active');
    
    // Activate current speed
    if (gameSpeed === 0) {
        pauseBtn.classList.add('active');
    } else if (gameSpeed === 1) {
        playBtn.classList.add('active');
    } else {
        fastForwardBtn.classList.add('active');
    }
}

// Add this near the top with other event listeners
canvas.addEventListener('contextmenu', (event: MouseEvent) => {
    event.preventDefault(); // Prevent the default context menu
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const col = Math.floor(mouseX / (canvas.width / COLS));
    const row = Math.floor(mouseY / (canvas.height / ROWS));

    const facility = USER.grid.getFacility(row, col);
    if (facility) {
        if (confirm(`Are you sure you want to delete this ${facility.typeOf}?`)) {
            // Remove the facility from the grid
            USER.grid.removeFacility(row, col);
            
            // Decrement buildings count
            USER.decreaseBuildingCount(1);
            
            // Redraw the grid
            drawGrid();
        }
    }
});

// Help Button Functionality
function setupHelpButton() {
    const helpButton = document.getElementById('help-button')!;
    const helpModal = document.getElementById('help-modal')!;
    const closeHelp = document.getElementById('close-help')!;

    helpButton.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
    });

    closeHelp.addEventListener('click', () => {
        helpModal.classList.add('hidden');
    });

    // Close modal when clicking outside content
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.add('hidden');
        }
    });
}

// Call this in your initialization section
setupHelpButton();

// Handle window resize
window.addEventListener("resize", () => {
    setupCanvas();
    drawGrid();
});

// Initialize
setupCanvas();
drawGrid();
initializeBuildingMenu();
updateStatsUI();
setupStatsToggle();
setupGameControls();
updateControlButtons();
startGameLoop();