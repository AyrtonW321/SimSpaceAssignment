import { Grid } from './gridClass.js';
import { Facility } from './facilityClass.js';

// Canvas setup
const canvas = document.getElementById("gridCanvas") as HTMLCanvasElement | null;
const ctx = canvas ? canvas.getContext("2d") : null;

// Grid configuration
const gridSize = 50;
const squareSize = (canvas?.width ?? 0) / gridSize;

// Initialize the game grid
const gameGrid = new Grid(gridSize, gridSize);

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
      col: j
    });
  }
}

// Concrete Facility implementation
class GameFacility extends Facility {
  constructor(
    x: number,
    y: number,
    buildCost: number,
    powerConsumption: number,
    typeOf: string,
    private _monthlyRevenue: number,
    private _monthlyPollution: number,
    private _maintenanceCost: number,
    public name: string,
    public image: string
  ) {
    super(x, y, buildCost, powerConsumption, typeOf);
  }

  public calcMonthlyRevenue(): number {
    return this._hasPower ? this._monthlyRevenue : 0;
  }

  public calcMonthlyPollution(): number {
    return this._monthlyPollution;
  }

  public calcMaintenanceCost(): number {
    return this._maintenanceCost;
  }
}

// Facility type definitions
type FacilityType = 'essential' | 'residential' | 'industrial' | 'commercial' | 'defense';

interface FacilityItem {
  name: string;
  image: string;
  type: FacilityType;
  buildCost: number;
  powerConsumption: number;
  monthlyRevenue: number;
  monthlyPollution: number;
  maintenanceCost: number;
}

// Facility database
const facilities: Record<FacilityType, FacilityItem[]> = {
  essential: [
    { 
      name: "Emergency Services", 
      image: "police.png",
      type: "essential",
      buildCost: 5000,
      powerConsumption: 50,
      monthlyRevenue: 0,
      monthlyPollution: 2,
      maintenanceCost: 200
    },
    // Add other essential facilities...
  ],
  residential: [
    { 
      name: "Luxury Homes", 
      image: "luxury.png",
      type: "residential",
      buildCost: 8000,
      powerConsumption: 30,
      monthlyRevenue: 1200,
      monthlyPollution: 5,
      maintenanceCost: 300
    },
  ],
  industrial: [],
  commercial: [],
  defense: [],
};

// UI State
let selectedFacility: FacilityItem | null = null;

// Drawing functions
function drawGrid() {
  if (!ctx || !canvas) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid squares
  for (const square of gridSquares) {
    const facility = gameGrid.getFacility(square.row, square.col);
    
    ctx.fillStyle = facility ? getFacilityColor(facility) : "#ebebeb";
    ctx.strokeStyle = '#CCC';
    ctx.fillRect(square.x, square.y, squareSize, squareSize);
    ctx.strokeRect(square.x, square.y, squareSize, squareSize);
    
    // Draw facility image if available
    if (facility instanceof GameFacility) {
      drawFacilityImage(facility, square.x, square.y);
    }
  }
}

function getFacilityColor(facility: Facility): string {
  switch (facility.typeOf) {
    case 'essential': return '#4CAF50';
    case 'residential': return '#FFC107';
    case 'industrial': return '#F44336';
    case 'commercial': return '#9C27B0';
    case 'defense': return '#2196F3';
    default: return '#ebebeb';
  }
}

function drawFacilityImage(facility: GameFacility, x: number, y: number) {
  if (!ctx) return;
  
  const img = new Image();
  img.src = `./Imgs/${facility.typeOf}/${facility.image}`;
  img.onload = () => {
    ctx?.drawImage(img, x, y, squareSize, squareSize);
  };
}

// Building placement
canvas?.addEventListener("click", (event: MouseEvent) => {
  if (!canvas || !selectedFacility) return;
  
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const clickedSquare = gridSquares.find(square => 
    mouseX >= square.x &&
    mouseX <= square.x + squareSize &&
    mouseY >= square.y &&
    mouseY <= square.y + squareSize
  );
  
  if (clickedSquare) {
    placeFacility(clickedSquare.row, clickedSquare.col, selectedFacility);
  }
});

function placeFacility(row: number, col: number, facilityItem: FacilityItem): boolean {
  const existingFacility = gameGrid.getFacility(row, col);
  if (existingFacility) return false; // Space occupied
  
  const newFacility = new GameFacility(
    row,
    col,
    facilityItem.buildCost,
    facilityItem.powerConsumption,
    facilityItem.type,
    facilityItem.monthlyRevenue,
    facilityItem.monthlyPollution,
    facilityItem.maintenanceCost,
    facilityItem.name,
    facilityItem.image
  );
  
  const added = gameGrid.addFacility(newFacility, row, col);
  if (added) {
    drawGrid();
    return true;
  }
  return false;
}

// UI Setup
function setupBuildingSelector() {
  const typeButtons = document.querySelectorAll('.typeButton');
  const selectorContainer = document.querySelector('.selectorButtonContainer');
  
  typeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-type') as FacilityType;
      displayBuildings(type);
    });
  });
}

function displayBuildings(type: FacilityType) {
  const container = document.querySelector('.selectorButtonContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  facilities[type].forEach(item => {
    const button = document.createElement('button');
    button.className = 'building-selector';
    button.innerHTML = `
      <img src="./Imgs/${type}/${item.image}" alt="${item.name}">
      <span>${item.name}</span>
    `;
    
    button.addEventListener('click', () => {
      selectedFacility = item;
    });
    
    container.appendChild(button);
  });
}

// Initialize
setupBuildingSelector();
drawGrid();