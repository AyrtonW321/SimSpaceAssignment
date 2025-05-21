import { Grid } from "./gridClass.js";
import { Facility } from "./facilityClass.js";
import {
  EmergencyServices,
  EducationCenter,
  MedicalCenter,
  GovernmentFacility,
  PowerPlant,
} from "./essentialsClass.js";
import { Factory, EnvironmentalFacility } from "./industrialClass.js";
import {
  LuxuryResidence,
  ComfortableResidence,
  AffordableResidence,
} from "./residenceClass.js";
import {Commercials, Office, Restaurant, Store} from "./commercialsClass.js";
import { PlanetaryDefense } from "./planetaryDefense.js";

// Canvas setup
const canvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// Game state
const gridSize = 50;
const gameGrid = new Grid(gridSize, gridSize);
const squareSize = canvas.width / gridSize;

// Game statistics
let userMoney = 5000000000;
let currentTime = 0;
let totalPopulation = 0;
let totalPollution = 0;
let hasPlanetaryDefense = false;
let isGameOver = false;

// Visual grid representation
interface GridSquare {
  x: number;
  y: number;
  row: number;
  col: number;
}

const gridSquares: GridSquare[] = [];
for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    gridSquares.push({
      x: i * squareSize,
      y: j * squareSize,
      row: i,
      col: j,
    });
  }
}

// Building type definitions
type FacilityType =
  | "essential"
  | "residential"
  | "industrial"
  | "commercial"
  | "defense";

interface BuildingOption {
  name: string;
  image: string;
  constructor: (x: number, y: number) => Facility;
  cost: number;
}

// Building database
const buildings: Record<FacilityType, BuildingOption[]> = {
  essential: [
    {
      name: "Emergency Services",
      image: "police.png",
      constructor: (x: number, y: number) => new EmergencyServices(x, y),
      cost: 100000000,
    },
    {
      name: "Education Center",
      image: "school.png",
      constructor: (x: number, y: number) => new EducationCenter(x, y),
      cost: 500000000,
    },
    {
      name: "Medical Center",
      image: "hospital.png",
      constructor: (x: number, y: number) => new MedicalCenter(x, y),
      cost: 1000000000,
    },
    {
      name: "Government Facility",
      image: "government.png",
      constructor: (x: number, y: number) => new GovernmentFacility(x, y),
      cost: 100000000,
    },
    {
      name: "Power Plant",
      image: "powerplant.png",
      constructor: (x: number, y: number) => new PowerPlant(x, y),
      cost: 500000000,
    },
  ],
  residential: [
    {
      name: "Luxury Residence",
      image: "luxury.png",
      constructor: (x: number, y: number) => new LuxuryResidence(x, y),
      cost: 1000000000,
    },
    {
      name: "Comfortable Residence",
      image: "comfortable.png",
      constructor: (x: number, y: number) => new ComfortableResidence(x, y),
      cost: 500000000,
    },
    {
      name: "Affordable Residence",
      image: "affordable.png",
      constructor: (x: number, y: number) => new AffordableResidence(x, y),
      cost: 50000000,
    },
  ],
  industrial: [
    {
      name: "Factory",
      image: "factory.png",
      constructor: (x: number, y: number) => new Factory(x, y),
      cost: 50000000,
    },
    {
      name: "Environmental Facility",
      image: "environmental.png",
      constructor: (x: number, y: number) => new EnvironmentalFacility(x, y),
      cost: 200000000,
    },
  ],
  commercial: [
    {
      name: "Store",
      image: "store.png",
      constructor: (x: number, y: number) => new Store(x, y),
      cost: 2000000,
    },
    {
      name: "Restaurant",
      image: "restaurant.png",
      constructor: (x: number, y: number) => new Restaurant(x, y),
      cost: 250000,
    },
    {
      name: "Office",
      image: "office.png",
      constructor: (x: number, y: number) => new Office(x, y),
      cost: 3000000,
    },
  ],
  defense: [
    {
      name: "Planetary Defense",
      image: "shield.png",
      constructor: (x: number, y: number) => new PlanetaryDefense(x, y),
      cost: 1000000000000,
    },
  ],
};

// UI State
let selectedBuilding: BuildingOption | null = null;

// Drawing functions
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid squares
  for (const square of gridSquares) {
    const facility = gameGrid.getFacility(square.row, square.col);

    ctx.fillStyle = facility ? getFacilityColor(facility) : "#ebebeb";
    ctx.strokeStyle = "#CCC";
    ctx.fillRect(square.x, square.y, squareSize, squareSize);
    ctx.strokeRect(square.x, square.y, squareSize, squareSize);

    // Draw facility image if available
    if (facility) {
      drawFacilityImage(facility, square.x, square.y);
    }
  }

  // Update UI displays
  updateGameInfo();
}

function getFacilityColor(facility: Facility): string {
  if (
    facility.typeOf.includes("EmergencyServices") ||
    facility.typeOf.includes("EducationCenter") ||
    facility.typeOf.includes("MedicalCenter") ||
    facility.typeOf.includes("GovernmentFacility") ||
    facility.typeOf.includes("PowerPlant")
  ) {
    return "#4CAF50"; // Green for essential
  } else if (facility.typeOf.includes("Residence")) {
    return "#FFC107"; // Yellow for residential
  } else if (
    facility.typeOf.includes("Factory") ||
    facility.typeOf.includes("EnvironmentalFacility")
  ) {
    return "#F44336"; // Red for industrial
  } else if (facility.typeOf.includes("PlanetaryDefense")) {
    return "#2196F3"; // Blue for defense
  } else if (
    facility.typeOf.includes("Store") ||
    facility.typeOf.includes("Restaurant") ||
    facility.typeOf.includes("Office")
  ) {
    return "#9C27B0"; // Purple for commercial
  }
  return "#ebebeb"; // Default color
}

function drawFacilityImage(facility: Facility, x: number, y: number) {
  const type = getBuildingType(facility);

  // Flatten all building options into one array
  const allBuildings = Object.values(buildings).flat();

  // Find the building option by comparing constructor name
  const match = allBuildings.find(
    (b) => facility instanceof b.constructor(0, 0).constructor
  );

  if (match) {
    const img = new Image();
    img.src = `./Imgs/${type.toLowerCase()}/${match.image}`;
    img.onload = () => {
      ctx.drawImage(img, x, y, squareSize, squareSize);
    };
  } else {
    console.warn("No image found for facility:", facility);
  }
}

function getBuildingType(facility: Facility): FacilityType {
  if (
    facility.typeOf.includes("EmergencyServices") ||
    facility.typeOf.includes("EducationCenter") ||
    facility.typeOf.includes("MedicalCenter") ||
    facility.typeOf.includes("GovernmentFacility") ||
    facility.typeOf.includes("PowerPlant")
  ) {
    return "essential";
  } else if (facility.typeOf.includes("Residence")) {
    return "residential";
  } else if (
    facility.typeOf.includes("Factory") ||
    facility.typeOf.includes("EnvironmentalFacility")
  ) {
    return "industrial";
  } else if (facility.typeOf.includes("PlanetaryDefense")) {
    return "defense";
  } else if (
    facility.typeOf.includes("Store") ||
    facility.typeOf.includes("Restaurant") ||
    facility.typeOf.includes("Office")
  ) {
    return "commercial";
  }
  return "essential"; // Default fallback
}

function updateGameInfo() {
  document.getElementById("timeDisplay")!.textContent = currentTime.toString();
  document.getElementById("moneyDisplay")!.textContent =
    userMoney.toLocaleString();
  document.getElementById("populationDisplay")!.textContent =
    totalPopulation.toLocaleString();
  document.getElementById("scoreDisplay")!.textContent =
    calculateScore().toLocaleString();
}

function calculateScore(): number {
  let happyPopulation = 0;
  let contentPopulation = 0;

  // Iterate through all facilities to find residences
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const facility = gameGrid.getFacility(i, j);

      if (facility && facility.typeOf.includes("Residence")) {
        if (facility instanceof LuxuryResidence) {
          happyPopulation += facility.happyPopulation;
          contentPopulation += facility.contentPopulation;
        } else if (facility instanceof ComfortableResidence) {
          happyPopulation += facility.happyPopulation;
          contentPopulation += facility.contentPopulation;
        } else if (facility instanceof AffordableResidence) {
          happyPopulation += facility.happyPopulation;
          contentPopulation += facility.contentPopulation;
        }
      }
    }
  }

  // Apply the scoring formula
  return 3 * happyPopulation + contentPopulation - totalPollution;
}

// Building placement
canvas.addEventListener("click", (event: MouseEvent) => {
  if (!selectedBuilding) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const clickedSquare = gridSquares.find(
    (square) =>
      mouseX >= square.x &&
      mouseX <= square.x + squareSize &&
      mouseY >= square.y &&
      mouseY <= square.y + squareSize
  );

  if (clickedSquare) {
    if (userMoney < selectedBuilding.cost) {
      alert("Not enough money!");
      return;
    }

    const building = selectedBuilding.constructor(
      clickedSquare.row,
      clickedSquare.col
    );

    // Check for Planetary Defense uniqueness
    if (
      building.typeOf.includes("PlanetaryDefense") &&
      gameGrid.countFacilities("PlanetaryDefense") > 0
    ) {
      alert("Only one Planetary Defense can be built!");
      return;
    }

    // Use the Grid class to add the facility
    const success = gameGrid.addFacility(
      building,
      clickedSquare.row,
      clickedSquare.col
    );

    if (success) {
      userMoney -= selectedBuilding.cost;
      drawGrid();
    } else {
      alert("Could not place building here!");
    }
  }
});

// Game logic functions
function calculateMonthlyUpdates() {
  currentTime++;

  // Check for planetary defense
  hasPlanetaryDefense = gameGrid.countFacilities("PlanetaryDefense") > 0;

  if (!hasPlanetaryDefense) {
    checkForDisasters();
    if (isGameOver) return;
  }

  // Process all facilities
  let monthlyRevenue = 0;
  let monthlyCosts = 0;
  totalPopulation = 0;
  totalPollution = 0;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const facility = gameGrid.getFacility(i, j);
      if (!facility) continue;

      facility.incrementMonths();

      // Calculate revenue and costs - handle commercial buildings differently
      if (
        facility.typeOf.includes("Store") ||
        facility.typeOf.includes("Restaurant") ||
        facility.typeOf.includes("Office")
      ) {
        // Commercial buildings need the grid for their calculations
        monthlyRevenue += facility.calcMonthlyRevenue(gameGrid);
        monthlyCosts += facility.calcMaintenanceCost(gameGrid);
      } else {
        // Other buildings
        monthlyRevenue += facility.calcMonthlyRevenue();
        monthlyCosts += facility.calcMaintenanceCost();
      }

      // Calculate pollution (same for all)
      totalPollution += facility.calcMonthlyPollution();

      // Handle population for residences
      if (facility.typeOf.includes("Residence")) {
        if (
          facility instanceof LuxuryResidence ||
          facility instanceof ComfortableResidence ||
          facility instanceof AffordableResidence
        ) {
          facility.updatePopulation(gameGrid);
          totalPopulation += facility.currPopulation;
        }
      }
    }
  }

  // Update game state
  userMoney += monthlyRevenue - monthlyCosts;

  if (userMoney < 0) {
    isGameOver = true;
    alert(`Game Over! Final Score: ${calculateScore()}`);
  }
}

function checkForDisasters() {
  if (Math.random() < 0.01) {
    // 1% chance per month
    isGameOver = true;
    alert("Disaster struck! Game Over!");
  }
}

// UI Setup
function setupBuildingSelector() {
  const typeButtons = document.querySelectorAll(".typeButton");
  const selectorContainer = document.querySelector(".selectorButtonContainer")!;

  typeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.getAttribute("data-type") as FacilityType;
      displayBuildings(type);
    });
  });
}

function displayBuildings(type: FacilityType) {
  const container = document.querySelector(".selectorButtonContainer")!;
  container.innerHTML = "";

  buildings[type].forEach((building) => {
    const button = document.createElement("button");
    button.className = "selectorButton";

    // Correct class added to the <img> element
    const img = document.createElement("img");
    img.src = `./Imgs/${type}/${building.image}`;
    img.alt = building.name;
    img.className = "buildingImage";

    button.appendChild(img);

    button.addEventListener("click", () => {
      selectedBuilding = building;
      document.querySelectorAll(".selectorButton").forEach((btn) => {
        btn.classList.remove("selected");
      });
      button.classList.add("selected");
    });

    container.appendChild(button);
  });
}

// Game loop
function gameLoop() {
  calculateMonthlyUpdates();
  drawGrid();

  if (isGameOver) {
    return;
  }

  setTimeout(gameLoop, 10000); // 10 second months
}

// Initialize
setupBuildingSelector();
drawGrid();
gameLoop();
