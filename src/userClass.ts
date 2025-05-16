import { Grid } from "./gridClass";
import { Facility } from "./facilityClass";
import {
    Residence,
    LuxuryResidence,
    ComfortableResidence,
    AffordableResidence,
} from "./residenceClass";
import {
    EmergencyServices,
    EducationCenter,
    MedicalCenter,
    GovernmentFacility,
    PowerPlant,
} from "./essentialsClass";
import {
    IndustrialFacility,
    Factory,
    EnvironmentalFacility,
} from "./industrialClass";
import { PlanetaryDefense } from "./planetaryDefense";

export class User {
    private _grid: Grid;
    private _usedCoords: number[][] = [];
    private _buildingsBuilt: number = 0;
    private _maxBuildings: number;
    private _userMoney: number = 5000000000;
    private _currentTime: number = 0;
    private _totalPopulation: number = 0;
    private _totalPollution: number = 0;
    private _hasPlanetaryDefense: boolean = false;
    private _isGameOver: boolean = false;
    private _totalPowerGenerated: number = 0;
    private _totalPowerUsed: number = 0;

    constructor(rows: number, col: number) {
        this._grid = new Grid(rows, col);
        this._maxBuildings = this._grid.rows * this._grid.columns;
    }

    // Getters
    public get grid(): Grid {
        return this._grid;
    }
    public get usedCoords(): number[][] {
        return this._usedCoords;
    }
    public get buildingsBuilt(): number {
        return this._buildingsBuilt;
    }
    public get maxBuildings(): number {
        return this._maxBuildings;
    }
    public get userMoney(): number {
        return this._userMoney;
    }
    public get currentTime(): number {
        return this._currentTime;
    }
    public get totalPopulation(): number {
        return this._totalPopulation;
    }
    public get totalPollution(): number {
        return this._totalPollution;
    }
    public get hasPlanetaryDefense(): boolean {
        return this._hasPlanetaryDefense;
    }
    public get isGameOver(): boolean {
        return this._isGameOver;
    }
    public get powerBalance(): number {
        return this._totalPowerGenerated - this._totalPowerUsed;
    }

    public calculateMonthlyUpdates(): void {
        // add time
        this._currentTime++;

        // check for planetary defense and disasters
        // check for planetary defense
        this._hasPlanetaryDefense =
            this._grid.countFacilities("PlanetaryDefense") > 0;

        if (!this._hasPlanetaryDefense) {
            this.checkForDisasters();
            if (this._isGameOver) return;
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
            if (facility instanceof Residence) {
                facility.updatePopulation(this._grid);
                this._totalPopulation += facility.currPopulation;
            }

            // reset pollution before calculating
            let monthlyPollution = 0;

            // sum pollution from all polluting facilities
            allFacilities.forEach((facility) => {
                if (!(facility instanceof EnvironmentalFacility)) {
                    monthlyPollution += facility.calcMonthlyPollution();
                }
            });

            // calculate total pollution reduction from EnvironmentalFacilities
            let totalReduction = 0;
            allFacilities.forEach((facility) => {
                if (facility instanceof EnvironmentalFacility) {
                    const radius = facility.pollutionReductionRadius;
                    const x = facility.x;
                    const y = facility.y;

                    let localPollution = 0;
                    allFacilities.forEach((envFacility) => {
                        if (!(envFacility instanceof EnvironmentalFacility)) {
                            const dx = envFacility.x - x;
                            const dy = envFacility.y - y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist <= radius) {
                                localPollution +=
                                    envFacility.calcMonthlyPollution();
                            }
                        }
                    });

                    const reduction = Math.min(localPollution, 30000);
                    totalReduction += reduction;
                }
            });

            // final pollution value this month
            this._totalPollution = Math.max(
                0,
                monthlyPollution - totalReduction
            );

            if (
                facility instanceof IndustrialFacility &&
                !facility.isNearPowerPlant(this._grid)
            ) {
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
            alert("Game over. Your final score: " + this.calculateScore());
        }
    }

    private updatePowerStats(): void {
        const allFacilities = this.getAllFacilities();

        this._totalPowerGenerated = 0;
        for (const facility of allFacilities) {
            if (facility instanceof PowerPlant) {
                this._totalPowerGenerated += facility.powerOutput;
            }
        }

        const consumers = allFacilities.filter(
            (f) => !(f instanceof PowerPlant)
        );

        const sortedConsumers = consumers.sort((a, b) => {
            let priorityA = 3;
            let priorityB = 3;

            if (a instanceof Residence) priorityA = 1;
            else if (a.typeOf.includes("Center") || a.typeOf.includes("Store"))
                priorityA = 2;

            if (b instanceof Residence) priorityB = 1;
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
            } else {
                facility.updatePowerStatus(false);
            }
        }

        this._totalPowerUsed = this._totalPowerGenerated - powerLeft;
    }

    public getFacilityAt(rows: number, col: number): Facility | null {
        const facility = this._grid.getFacility(rows, col);
        if (facility === null) {
            return null;
        }
        return facility;
    }

    public getFacilitiesOfType(type: string): Facility[] {
        const facilities: Facility[] = [];
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

    public getAllFacilities(): Facility[] {
        const facilities: Facility[] = [];
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

    public calculateScore(): number {
        let happyPop = 0;
        let contentPop = 0;

        this.getAllFacilities()
            .filter((facility) => facility.typeOf.includes("Residence"))
            .forEach((residence) => {
                const res = residence as Residence;
                happyPop += res.happyPopulation;
                contentPop += res.contentPopulation;
            });

        return 3 * happyPop + contentPop - this._totalPollution;
    }

    private checkForDisasters(): void {
        if (Math.random() < 0.01) {
            // asteroid
            this._isGameOver = true;
            alert("Game over. Your final score: " + this.calculateScore());
        }
        if (Math.random() < 0.01) {
            // alien
            this._isGameOver = true;
            alert("Game over. Your final score: " + this.calculateScore());
        }
    }

    // Building methods

    public canAfford(cost: number): boolean {
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

    public buildEnvFacility(x: number, y: number): boolean {
        return this.buildFacility(new EnvironmentalFacility(x, y), 200000000);
    }

    public buildFactory(x: number, y: number): boolean {
        return this.buildFacility(new Factory(x, y), 50000000);
    }

    public buildPP(x: number, y: number): boolean {
        return this.buildFacility(new PowerPlant(x, y), 500000000);
    }

    public buildEduCenter(x: number, y: number): boolean {
        return this.buildFacility(new EducationCenter(x, y), 500000000);
    }

    public buildMedCenter(x: number, y: number): boolean {
        return this.buildFacility(new MedicalCenter(x, y), 1000000000);
    }

    public buildEmergencyServ(x: number, y: number): boolean {
        return this.buildFacility(new EmergencyServices(x, y), 100000000);
    }

    public buildGovernment(x: number, y: number): boolean {
        return this.buildFacility(new GovernmentFacility(x, y), 100000000);
    }

    public buildLuxury(x: number, y: number): boolean {
        return this.buildFacility(new LuxuryResidence(x, y), 1000000000);
    }

    public buildComfort(x: number, y: number): boolean {
        return this.buildFacility(new ComfortableResidence(x, y), 500000000);
    }

    public buildAffordable(x: number, y: number): boolean {
        return this.buildFacility(new AffordableResidence(x, y), 50000000);
    }

    public buildPlanetaryDefense(x: number, y: number): boolean {
        if (this._hasPlanetaryDefense) {
            return false;
        }
        return this.buildFacility(new PlanetaryDefense(x, y), 1000000000000);
    }

    private buildFacility(facility: Facility, cost: number): boolean {
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
        this._userMoney -= cost;
        this._buildingsBuilt++;
        this._usedCoords.push([facility.x, facility.y]);
        return this._grid.addFacility(facility, facility.x, facility.y);
    }
}
