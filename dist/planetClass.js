import { Grid } from "./gridClass.js";
import { Residence, LuxuryResidence, ComfortableResidence, AffordableResidence, } from "./residenceClass.js";
import { EmergencyServices, EducationCenter, MedicalCenter, GovernmentFacility, PowerPlant, } from "./essentialsClass.js";
import { IndustrialFacility, Factory, EnvironmentalFacility, } from "./industrialClass.js";
import { Warehouse } from "./industrialClass.js";
import { Commercials, Store, Restaurant, Office } from "./commercialsClass.js";
import { PlanetaryDefense } from "./planetaryDefense.js";
// Canvas setup
const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");
export class Planet {
    constructor(rows, columns) {
        this._usedCoords = [];
        this._buildingsBuilt = 0;
        this._userMoney = 5000000000;
        this._currentTime = 0;
        this._totalPopulation = 0;
        this._totalPollution = 0;
        this._hasPlanetaryDefense = false;
        this._isGameOver = false;
        this._totalPowerGenerated = 0;
        this._totalPowerUsed = 0;
        this._monthlyBalance = 0;
        this._gridSquares = [];
        // Initialize the grid using the Grid class
        this._grid = new Grid(rows, columns);
        this._maxBuildings = rows * columns;
        canvas.width = rows * 20;
        canvas.height = columns * 20;
        this._squareSize = canvas.width / rows;
        this.initializeGridSquares();
    }
    initializeGridSquares() {
        // Create grid squares based on the Grid class dimensions
        for (let i = 0; i < this._grid.rows; i++) {
            for (let j = 0; j < this._grid.columns; j++) {
                this._gridSquares.push({
                    x: i * this._squareSize,
                    y: j * this._squareSize,
                    row: i,
                    col: j,
                });
            }
        }
    }
    // Getters
    get grid() {
        return this._grid;
    }
    get usedCoords() {
        return this._usedCoords;
    }
    get buildingsBuilt() {
        return this._buildingsBuilt;
    }
    get maxBuildings() {
        return this._maxBuildings;
    }
    get userMoney() {
        return this._userMoney;
    }
    get currentTime() {
        return this._currentTime;
    }
    get totalPopulation() {
        return this._totalPopulation;
    }
    get totalPollution() {
        return this._totalPollution;
    }
    get hasPlanetaryDefense() {
        return this._hasPlanetaryDefense;
    }
    get isGameOver() {
        return this._isGameOver;
    }
    get powerBalance() {
        return this._totalPowerGenerated - this._totalPowerUsed;
    }
    get monthlyBalance() {
        return this._monthlyBalance;
    }
    // Drawing methods
    drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw grid squares using the Grid class data
        for (const square of this._gridSquares) {
            const facility = this._grid.getFacility(square.row, square.col);
            ctx.fillStyle = facility ? this.getFacilityColor(facility) : "#ebebeb";
            ctx.strokeStyle = "#CCC";
            ctx.fillRect(square.x, square.y, this._squareSize, this._squareSize);
            ctx.strokeRect(square.x, square.y, this._squareSize, this._squareSize);
            // Draw facility image if available
            if (facility) {
                this.drawFacilityImage(facility, square.x, square.y);
            }
        }
        this.updateGameInfo();
    }
    getFacilityColor(facility) {
        if (facility.typeOf.includes("EmergencyServices") ||
            facility.typeOf.includes("EducationCenter") ||
            facility.typeOf.includes("MedicalCenter") ||
            facility.typeOf.includes("GovernmentFacility") ||
            facility.typeOf.includes("PowerPlant")) {
            return "#4CAF50"; // Green for essential
        }
        else if (facility.typeOf.includes("Residence")) {
            return "#FFC107"; // Yellow for residential
        }
        else if (facility.typeOf.includes("Factory") ||
            facility.typeOf.includes("EnvironmentalFacility")) {
            return "#F44336"; // Red for industrial
        }
        else if (facility.typeOf.includes("PlanetaryDefense")) {
            return "#2196F3"; // Blue for defense
        }
        else if (facility.typeOf.includes("Store") ||
            facility.typeOf.includes("Restaurant") ||
            facility.typeOf.includes("Office")) {
            return "#9C27B0"; // Purple for commercial
        }
        return "#ebebeb"; // Default color
    }
    drawFacilityImage(facility, x, y) {
        const type = this.getBuildingType(facility);
        const buildingOption = this.getBuildingOption(facility, type);
        if (buildingOption) {
            const img = new Image();
            img.src = `./Imgs/${type.toLowerCase()}/${buildingOption.image}`;
            img.onload = () => {
                ctx.drawImage(img, x, y, this._squareSize, this._squareSize);
            };
        }
    }
    getBuildingType(facility) {
        if (facility.typeOf.includes("EmergencyServices") ||
            facility.typeOf.includes("EducationCenter") ||
            facility.typeOf.includes("MedicalCenter") ||
            facility.typeOf.includes("GovernmentFacility") ||
            facility.typeOf.includes("PowerPlant")) {
            return "essential";
        }
        else if (facility.typeOf.includes("Residence")) {
            return "residential";
        }
        else if (facility.typeOf.includes("Factory") ||
            facility.typeOf.includes("EnvironmentalFacility")) {
            return "industrial";
        }
        else if (facility.typeOf.includes("PlanetaryDefense")) {
            return "defense";
        }
        else if (facility.typeOf.includes("Store") ||
            facility.typeOf.includes("Restaurant") ||
            facility.typeOf.includes("Office")) {
            return "commercial";
        }
        return "essential"; // Default fallback
    }
    getBuildingOption(facility, type) {
        const allBuildings = Object.values(buildings).flat();
        return allBuildings.find(b => facility instanceof b.constructor(0, 0).constructor) || null;
    }
    updateGameInfo() {
        document.getElementById("timeDisplay").textContent = this._currentTime.toString();
        document.getElementById("moneyDisplay").textContent = this._userMoney.toLocaleString();
        document.getElementById("populationDisplay").textContent = this._totalPopulation.toLocaleString();
        document.getElementById("scoreDisplay").textContent = this.calculateScore().toLocaleString();
    }
    // Game logic methods
    calculateMonthlyUpdates() {
        this._currentTime++;
        this.updatePlanetaryDefenseStatus();
        if (!this._hasPlanetaryDefense) {
            this.checkForDisasters();
            if (this._isGameOver)
                return;
        }
        this.updatePowerStats();
        this.resetMonthlyCounters();
        const allFacilities = this.getAllFacilities();
        this.processFacilities(allFacilities);
        this.applyEnvironmentalReductions(allFacilities);
        this.finalizeMonthlyUpdates();
        this.drawGrid();
    }
    updatePlanetaryDefenseStatus() {
        this._hasPlanetaryDefense =
            this._grid.countFacilities("PlanetaryDefense") > 0;
    }
    resetMonthlyCounters() {
        this._totalPopulation = 0;
        this._totalPollution = 0;
        this._monthlyBalance = 0;
    }
    processFacilities(facilities) {
        facilities.forEach((facility) => {
            if (!(facility instanceof EnvironmentalFacility)) {
                this._totalPollution += facility.calcMonthlyPollution();
            }
        });
        facilities.forEach((facility) => {
            facility.incrementMonths();
            const revenue = this.calculateFacilityRevenue(facility);
            const maintenance = this.calculateFacilityMaintenance(facility);
            this._monthlyBalance += revenue - maintenance;
            if (facility instanceof Residence) {
                this.processResidence(facility);
            }
        });
    }
    calculateFacilityRevenue(facility) {
        if (!facility.hasPower)
            return 0;
        if (facility instanceof Commercials) {
            return facility.calcMonthlyRevenue(this._grid);
        }
        if (facility instanceof Factory) {
            return this.calculateFactoryRevenue(facility);
        }
        return facility.calcMonthlyRevenue();
    }
    calculateFactoryRevenue(factory) {
        if (!factory.hasPower)
            return 0;
        let revenue = factory.calcMonthlyRevenue();
        const hasWarehouseNearby = this._grid.hasFacilityTypeInRadius(factory.x, factory.y, 5, "Warehouse");
        return hasWarehouseNearby ? revenue * 2 : revenue;
    }
    calculateFacilityMaintenance(facility) {
        return facility instanceof Commercials
            ? facility.calcMaintenanceCost(this._grid)
            : facility.calcMaintenanceCost();
    }
    processResidence(residence) {
        residence.updatePopulation(this._grid);
        this._totalPopulation += residence.currPopulation;
    }
    applyEnvironmentalReductions(facilities) {
        const originalPollution = this._totalPollution;
        let totalReduction = 0;
        facilities.forEach((facility) => {
            if (facility instanceof EnvironmentalFacility) {
                const affected = this._grid
                    .getFacilityInRadius(facility.x, facility.y, facility.pollutionReductionRadius)
                    .filter((f) => !(f instanceof EnvironmentalFacility));
                const localPollution = affected.reduce((sum, f) => {
                    const dx = f.x - facility.x;
                    const dy = f.y - facility.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= facility.pollutionReductionRadius) {
                        return sum + f.calcMonthlyPollution();
                    }
                    return sum;
                }, 0);
                const facilityReduction = Math.min(localPollution, facility.maxPollutionReduction);
                totalReduction += facilityReduction;
                console.log(`EnvFac at ${facility.x},${facility.y} reduced ${facilityReduction} pollution`);
            }
        });
        const effectiveReduction = Math.min(totalReduction, originalPollution);
        this._totalPollution = Math.max(0, originalPollution - effectiveReduction);
        console.log(`Pollution: ${originalPollution} -> ${this._totalPollution} (reduced by ${effectiveReduction})`);
    }
    finalizeMonthlyUpdates() {
        this._userMoney += this._monthlyBalance;
        this._monthlyBalance = 0;
        if (this._userMoney < 0) {
            this._isGameOver = true;
            alert(`Game Over! Final Score: ${this.calculateScore()}`);
        }
    }
    updatePowerStats() {
        const allFacilities = this.getAllFacilities();
        this._totalPowerGenerated = allFacilities.reduce((sum, f) => sum + (f instanceof PowerPlant ? f.powerOutput : 0), 0);
        const consumers = allFacilities
            .filter((facility) => !(facility instanceof PowerPlant))
            .sort((a, b) => this.getPowerPriority(a) - this.getPowerPriority(b));
        let powerLeft = this._totalPowerGenerated;
        consumers.forEach((facility) => {
            const canPower = powerLeft >= facility.powerConsumption;
            facility.updatePowerStatus(canPower);
            if (canPower)
                powerLeft -= facility.powerConsumption;
        });
        allFacilities.forEach((facility) => {
            if (facility instanceof PowerPlant) {
                facility.updatePowerStatus(true);
            }
        });
        this._totalPowerUsed = this._totalPowerGenerated - powerLeft;
    }
    getPowerPriority(facility) {
        if (facility instanceof Residence)
            return 1;
        if (facility.typeOf.includes("Center") ||
            facility.typeOf === "EmergencyServices" ||
            facility.typeOf === "GovernmentFacility")
            return 2;
        if (facility.typeOf === "Store" || facility.typeOf === "Restaurant")
            return 3;
        if (facility instanceof IndustrialFacility)
            return 4;
        return 5;
    }
    getFacilityAt(rows, col) {
        const facility = this._grid.getFacility(rows, col);
        if (facility === null) {
            return null;
        }
        return facility;
    }
    getFacilitiesOfType(type) {
        const facilities = [];
        for (let i = 0; i < this._grid.rows; i++) {
            for (let j = 0; j < this._grid.columns; j++) {
                const facility = this._grid.getFacility(i, j);
                if (facility === null || facility === void 0 ? void 0 : facility.typeOf.includes(type)) {
                    facilities.push(facility);
                }
            }
        }
        return facilities;
    }
    getAllFacilities() {
        const facilities = [];
        for (let i = 0; i < this._grid.rows; i++) {
            for (let j = 0; j < this._grid.columns; j++) {
                const facility = this._grid.getFacility(i, j);
                if (facility) {
                    facilities.push(facility);
                }
            }
        }
        return facilities;
    }
    calculateScore() {
        let happyPop = 0;
        let contentPop = 0;
        this.getAllFacilities()
            .filter((facility) => facility.typeOf.includes("Residence"))
            .forEach((residence) => {
            const res = residence;
            happyPop += res.happyPopulation;
            contentPop += res.contentPopulation;
        });
        return 3 * happyPop + contentPop - this._totalPollution;
    }
    checkForDisasters() {
        if (Math.random() < 0.01) {
            this._isGameOver = true;
            alert("Game over. Your final score: " + this.calculateScore());
        }
    }
    // Building methods
    canAfford(cost) {
        return this._userMoney >= cost;
    }
    buildStore(x, y) {
        return this.buildFacility(new Store(x, y), 2000000);
    }
    buildRestaurant(x, y) {
        return this.buildFacility(new Restaurant(x, y), 250000);
    }
    buildOffice(x, y) {
        return this.buildFacility(new Office(x, y), 3000000);
    }
    buildWarehouse(x, y) {
        return this.buildFacility(new Warehouse(x, y), 10000000);
    }
    buildEnvFacility(x, y) {
        return this.buildFacility(new EnvironmentalFacility(x, y), 200000000);
    }
    buildFactory(x, y) {
        return this.buildFacility(new Factory(x, y), 50000000);
    }
    buildPP(x, y) {
        return this.buildFacility(new PowerPlant(x, y), 500000000);
    }
    buildEduCenter(x, y) {
        return this.buildFacility(new EducationCenter(x, y), 500000000);
    }
    buildMedCenter(x, y) {
        return this.buildFacility(new MedicalCenter(x, y), 1000000000);
    }
    buildEmergencyServ(x, y) {
        return this.buildFacility(new EmergencyServices(x, y), 100000000);
    }
    buildGovernment(x, y) {
        return this.buildFacility(new GovernmentFacility(x, y), 100000000);
    }
    buildLuxury(x, y) {
        return this.buildFacility(new LuxuryResidence(x, y), 1000000000);
    }
    buildComfort(x, y) {
        return this.buildFacility(new ComfortableResidence(x, y), 500000000);
    }
    buildAffordable(x, y) {
        return this.buildFacility(new AffordableResidence(x, y), 50000000);
    }
    buildPlanetaryDefense(x, y) {
        if (this._hasPlanetaryDefense) {
            return false;
        }
        this._hasPlanetaryDefense = true;
        return this.buildFacility(new PlanetaryDefense(x, y), 1000000000000);
    }
    buildFacility(facility, cost) {
        if (!this.canAfford(cost)) {
            return false;
        }
        if (this._grid.getFacility(facility.x, facility.y) !== null) {
            return false;
        }
        if (facility instanceof Residence) {
            if (!facility.canBeBuilt(this._grid)) {
                return false;
            }
        }
        if (facility instanceof IndustrialFacility) {
            if (!facility.canBeBuilt(this._grid)) {
                return false;
            }
        }
        this._userMoney -= cost;
        this._buildingsBuilt++;
        this._usedCoords.push([facility.x, facility.y]);
        return this._grid.addFacility(facility, facility.x, facility.y);
    }
    // Canvas interaction
    handleCanvasClick(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const clickedSquare = this._gridSquares.find((square) => mouseX >= square.x &&
            mouseX <= square.x + this._squareSize &&
            mouseY >= square.y &&
            mouseY <= square.y + this._squareSize);
        if (clickedSquare) {
            // You'll need to implement building selection logic here
            // Similar to the original user.ts click handler
        }
    }
}
const buildings = {
    essential: [
        {
            name: "Emergency Services",
            image: "police.png",
            constructor: (x, y) => new EmergencyServices(x, y),
            cost: 100000000,
        },
        {
            name: "Education Center",
            image: "school.png",
            constructor: (x, y) => new EducationCenter(x, y),
            cost: 500000000,
        },
        {
            name: "Medical Center",
            image: "hospital.png",
            constructor: (x, y) => new MedicalCenter(x, y),
            cost: 1000000000,
        },
        {
            name: "Government Facility",
            image: "government.png",
            constructor: (x, y) => new GovernmentFacility(x, y),
            cost: 100000000,
        },
        {
            name: "Power Plant",
            image: "powerplant.png",
            constructor: (x, y) => new PowerPlant(x, y),
            cost: 500000000,
        },
    ],
    residential: [
        {
            name: "Luxury Residence",
            image: "luxury.png",
            constructor: (x, y) => new LuxuryResidence(x, y),
            cost: 1000000000,
        },
        {
            name: "Comfortable Residence",
            image: "comfortable.png",
            constructor: (x, y) => new ComfortableResidence(x, y),
            cost: 500000000,
        },
        {
            name: "Affordable Residence",
            image: "affordable.png",
            constructor: (x, y) => new AffordableResidence(x, y),
            cost: 50000000,
        },
    ],
    industrial: [
        {
            name: "Factory",
            image: "factory.png",
            constructor: (x, y) => new Factory(x, y),
            cost: 50000000,
        },
        {
            name: "Environmental Facility",
            image: "environmental.png",
            constructor: (x, y) => new EnvironmentalFacility(x, y),
            cost: 200000000,
        },
    ],
    commercial: [
        {
            name: "Store",
            image: "store.png",
            constructor: (x, y) => new Store(x, y),
            cost: 2000000,
        },
        {
            name: "Restaurant",
            image: "restaurant.png",
            constructor: (x, y) => new Restaurant(x, y),
            cost: 250000,
        },
        {
            name: "Office",
            image: "office.png",
            constructor: (x, y) => new Office(x, y),
            cost: 3000000,
        },
    ],
    defense: [
        {
            name: "Planetary Defense",
            image: "shield.png",
            constructor: (x, y) => new PlanetaryDefense(x, y),
            cost: 1000000000000,
        },
    ],
};
const planet = new Planet(50, 50);
canvas.addEventListener("click", (event) => planet.handleCanvasClick(event));
//# sourceMappingURL=planetClass.js.map