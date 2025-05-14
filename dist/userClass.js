"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const gridClass_1 = require("./gridClass");
const residenceClass_1 = require("./residenceClass");
const essentialsClass_1 = require("./essentialsClass");
const industrialClass_1 = require("./industrialClass");
class User {
    _grid;
    _usedCoords = [];
    _buildingsBuilt = 0;
    _maxBuildings;
    _userMoney = 5000000000;
    _currentTime = 0;
    _totalPopulation = 0;
    _totalPollution = 0;
    _hasPlanetaryDefense = false;
    _isGameOver = false;
    _totalPowerGenerated = 0;
    _totalPowerUsed = 0;
    constructor(rows, col) {
        this._grid = new gridClass_1.Grid(rows, col);
        this._maxBuildings = this._grid.rows * this._grid.columns;
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
    calculateMonthlyUpdates() {
        // add time
        this._currentTime++;
        // check for planetary defense and disasters
        // check for planetary defense
        this._hasPlanetaryDefense =
            this._grid.countFacilities("PlanetaryDefense") > 0;
        if (!this._hasPlanetaryDefense) {
            this.checkForDisasters();
            if (this._isGameOver)
                return;
        }
        // get all facilities
        const allFacilities = this.getAllFacilities();
        // update power stats
        this.updatePowerStats();
        // reset totals for this month
        this._totalPopulation = 0;
        this._totalPollution = 0;
        let monthlyBalance = 0;
        // process each facility needs
        allFacilities.forEach((facility) => {
            // add facility age
            facility.incrementMonths();
            // calcualte monthly revenue and maintenance cost
            const revenue = facility.calcMonthlyRevenue();
            const maintenance = facility.calcMaintenanceCost();
            monthlyBalance += revenue - maintenance;
            // special facility needs
            if (facility instanceof residenceClass_1.Residence) {
                facility.updatePopulation(this._grid);
                this._totalPopulation += facility.currPopulation;
            }
            // reset pollution before calculating
            let monthlyPollution = 0;
            // sum pollution from all polluting facilities
            allFacilities.forEach((facility) => {
                if (!(facility instanceof industrialClass_1.EnvironmentalFacility)) {
                    monthlyPollution += facility.calcMonthlyPollution();
                }
            });
            // calculate total pollution reduction from EnvironmentalFacilities
            let totalReduction = 0;
            allFacilities.forEach((facility) => {
                if (facility instanceof industrialClass_1.EnvironmentalFacility) {
                    const radius = facility.pollutionReductionRadius;
                    const x = facility.x;
                    const y = facility.y;
                    let localPollution = 0;
                    allFacilities.forEach((other) => {
                        if (!(other instanceof industrialClass_1.EnvironmentalFacility)) {
                            const dx = other.x - x;
                            const dy = other.y - y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist <= radius) {
                                localPollution += other.calcMonthlyPollution();
                            }
                        }
                    });
                    const reduction = Math.min(localPollution, 30000);
                    totalReduction += reduction;
                }
            });
            // final pollution value this month
            this._totalPollution = Math.max(0, monthlyPollution - totalReduction);
            if (facility instanceof industrialClass_1.IndustrialFacility &&
                !facility.isNearPowerPlant(this._grid)) {
                facility.updatePowerStatus(false);
            }
        });
        // update user money
        this._userMoney += monthlyBalance;
        // ensure pollution doesn't go negative
        this._totalPollution = Math.max(0, this._totalPollution);
        // check if user ran out of money
        if (this._userMoney < 0) {
            this._isGameOver = true;
        }
    }
    updatePowerStats() {
        const allFacilities = this.getAllFacilities();
        this._totalPowerGenerated = 0;
        for (const facility of allFacilities) {
            if (facility instanceof essentialsClass_1.PowerPlant) {
                this._totalPowerGenerated += facility.powerOutput;
            }
        }
        const consumers = allFacilities.filter((f) => !(f instanceof essentialsClass_1.PowerPlant));
        const sortedConsumers = consumers.sort((a, b) => {
            let priorityA = 3;
            let priorityB = 3;
            if (a instanceof residenceClass_1.Residence)
                priorityA = 1;
            else if (a.typeOf.includes("Center") || a.typeOf.includes("Store"))
                priorityA = 2;
            if (b instanceof residenceClass_1.Residence)
                priorityB = 1;
            else if (b.typeOf.includes("Center") || b.typeOf.includes("Store"))
                priorityB = 2;
            return priorityA - priorityB;
        });
        let powerLeft = this._totalPowerGenerated;
        for (let i = 0; i < sortedConsumers.length; i++) {
            const facility = sortedConsumers[i];
            if (powerLeft >= facility.powerConsumption) {
                facility.updatePowerStatus(true);
                powerLeft -= facility.powerConsumption;
            }
            else {
                facility.updatePowerStatus(false);
            }
        }
        this._totalPowerUsed = this._totalPowerGenerated - powerLeft;
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
                if (facility?.typeOf.includes(type)) {
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
            // asteroid
            this._isGameOver = true;
        }
        if (Math.random() < 0.01) {
            // alien
            this._isGameOver = true;
        }
    }
    // Building methods
    canAfford(cost) {
        return this._userMoney >= cost;
    }
    // public buildStore(x: number, y: number): boolean {
    //     return this.buildFacility(new Store(x, y), 2000000);
    // }
    // public buildRestaurant(x: number, y: number): boolean {
    //     return this.buildFacility(new Restaurant(x, y), 250000);
    // }
    // public buildOffice(x: number, y: number): boolean {
    //     return this.buildFacility(new Office(x, y), 3000000);
    // }
    // public buildWarehouse(x: number, y: number): boolean {
    //     return this.buildFacility(new Warehouse(x, y), 50000000);
    // }
    buildEnvFacility(x, y) {
        return this.buildFacility(new industrialClass_1.EnvironmentalFacility(x, y), 200000000);
    }
    buildFactory(x, y) {
        return this.buildFacility(new industrialClass_1.Factory(x, y), 50000000);
    }
    buildPP(x, y) {
        return this.buildFacility(new essentialsClass_1.PowerPlant(x, y), 500000000);
    }
    buildEduCenter(x, y) {
        return this.buildFacility(new essentialsClass_1.EducationCenter(x, y), 500000000);
    }
    buildMedCenter(x, y) {
        return this.buildFacility(new essentialsClass_1.MedicalCenter(x, y), 1000000000);
    }
    buildEmergencyServ(x, y) {
        return this.buildFacility(new essentialsClass_1.EmergencyServices(x, y), 100000000);
    }
    buildGovernment(x, y) {
        return this.buildFacility(new essentialsClass_1.GovernmentFacility(x, y), 100000000);
    }
    buildLuxury(x, y) {
        return this.buildFacility(new residenceClass_1.LuxuryResidence(x, y), 1000000000);
    }
    buildComfort(x, y) {
        return this.buildFacility(new residenceClass_1.ComfortableResidence(x, y), 500000000);
    }
    buildAffordable(x, y) {
        return this.buildFacility(new residenceClass_1.AffordableResidence(x, y), 50000000);
    }
    buildFacility(facility, cost) {
        if (!this.canAfford(cost)) {
            return false;
        }
        if (this._grid.getFacility(facility.x, facility.y) !== null) {
            return false;
        }
        if (facility instanceof residenceClass_1.Residence) {
            if (!facility.canBeBuilt(this._grid)) {
                return false;
            }
        }
        this._userMoney -= cost;
        this._buildingsBuilt++;
        this._usedCoords.push([facility.x, facility.y]);
        return this._grid.addFacility(facility, facility.x, facility.y);
    }
}
exports.User = User;
//# sourceMappingURL=userClass.js.map