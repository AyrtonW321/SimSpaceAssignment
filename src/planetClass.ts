import { Grid } from "./gridClass.js";
import { Facility } from "./facilityClass.js";
import {
    Residence,
    LuxuryResidence,
    ComfortableResidence,
    AffordableResidence,
} from "./residenceClass.js";
import {
    EmergencyServices,
    EducationCenter,
    MedicalCenter,
    GovernmentFacility,
    PowerPlant,
} from "./essentialsClass.js";
import {
    IndustrialFacility,
    Factory,
    EnvironmentalFacility,
} from "./industrialClass";
import {Warehouse} from "./industrialClass.js";
import { Commercials, Store, Restaurant, Office } from "./commercialsClass.js";
import { PlanetaryDefense } from "./planetaryDefense.js";

export class Planet {
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
    private _monthlyBalance: number = 0;

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
    public get monthlyBalance(): number {
        return this._monthlyBalance;
    }

    public calculateMonthlyUpdates(): void {
        this._currentTime++;
        this.updatePlanetaryDefenseStatus();

        if (!this._hasPlanetaryDefense) {
            this.checkForDisasters();
            if (this._isGameOver) return;
        }

        this.updatePowerStats();
        this.resetMonthlyCounters();

        const allFacilities = this.getAllFacilities();
        this.processFacilities(allFacilities);
        this.applyEnvironmentalReductions(allFacilities);
        this.finalizeMonthlyUpdates();
    }

    private updatePlanetaryDefenseStatus(): void {
        this._hasPlanetaryDefense =
            this._grid.countFacilities("PlanetaryDefense") > 0;
    }

    private resetMonthlyCounters(): void {
        this._totalPopulation = 0;
        this._totalPollution = 0;
        this._monthlyBalance = 0;
    }

    private processFacilities(facilities: Facility[]): void {
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

    private calculateFacilityRevenue(facility: Facility): number {
        if (!facility.hasPower) return 0;

        if (facility instanceof Commercials) {
            return facility.calcMonthlyRevenue(this._grid);
        }
        if (facility instanceof Factory) {
            return this.calculateFactoryRevenue(facility);
        }
        return facility.calcMonthlyRevenue();
    }

    private calculateFactoryRevenue(factory: Factory): number {
        if (!factory.hasPower) return 0;

        let revenue = factory.calcMonthlyRevenue();

        const hasWarehouseNearby = this._grid.hasFacilityTypeInRadius(
            factory.x,
            factory.y,
            5,
            "Warehouse"
        );

        return hasWarehouseNearby ? revenue * 2 : revenue;
    }

    private calculateFacilityMaintenance(facility: Facility): number {
        return facility instanceof Commercials
            ? facility.calcMaintenanceCost(this._grid)
            : facility.calcMaintenanceCost();
    }

    private processResidence(residence: Residence): void {
        residence.updatePopulation(this._grid);
        this._totalPopulation += residence.currPopulation;
    }

    private applyEnvironmentalReductions(facilities: Facility[]): void {
        const originalPollution = this._totalPollution;
        let totalReduction = 0;

        facilities.forEach((facility) => {
            if (facility instanceof EnvironmentalFacility) {
                const affected = this._grid
                    .getFacilityInRadius(
                        facility.x,
                        facility.y,
                        facility.pollutionReductionRadius
                    )
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

                const facilityReduction = Math.min(
                    localPollution,
                    facility.maxPollutionReduction
                );
                totalReduction += facilityReduction;

                console.log(
                    `EnvFac at ${facility.x},${facility.y} reduced ${facilityReduction} pollution`
                );
            }
        });

        const effectiveReduction = Math.min(totalReduction, originalPollution);
        this._totalPollution = Math.max(
            0,
            originalPollution - effectiveReduction
        );

        console.log(
            `Pollution: ${originalPollution} -> ${this._totalPollution} (reduced by ${effectiveReduction})`
        );
    }

    private finalizeMonthlyUpdates(): void {
        this._userMoney += this._monthlyBalance;
        this._monthlyBalance = 0;

        if (this._userMoney < 0) {
            this._isGameOver = true;
            alert(`Game Over! Final Score: ${this.calculateScore()}`);
        }
    }

    private updatePowerStats(): void {
        const allFacilities = this.getAllFacilities();

        this._totalPowerGenerated = allFacilities.reduce(
            (sum, f) => sum + (f instanceof PowerPlant ? f.powerOutput : 0),
            0
        );

        const consumers = allFacilities
            .filter((facility) => !(facility instanceof PowerPlant))
            .sort(
                (a, b) => this.getPowerPriority(a) - this.getPowerPriority(b)
            );

        let powerLeft = this._totalPowerGenerated;
        consumers.forEach((facility) => {
            const canPower = powerLeft >= facility.powerConsumption;
            facility.updatePowerStatus(canPower);
            if (canPower) powerLeft -= facility.powerConsumption;
        });

        allFacilities.forEach((facility) => {
            if (facility instanceof PowerPlant) {
                facility.updatePowerStatus(true);
            }
        });

        this._totalPowerUsed = this._totalPowerGenerated - powerLeft;
    }

    private getPowerPriority(facility: Facility): number {
        if (facility instanceof Residence) return 1;
        if (
            facility.typeOf.includes("Center") ||
            facility.typeOf === "EmergencyServices" ||
            facility.typeOf === "GovernmentFacility"
        )
            return 2;
        if (facility.typeOf === "Store" || facility.typeOf === "Restaurant")
            return 3;
        if (facility instanceof IndustrialFacility) return 4;
        return 5;
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

    public buildStore(x: number, y: number): boolean {
        return this.buildFacility(new Store(x, y), 2000000);
    }

    public buildRestaurant(x: number, y: number): boolean {
        return this.buildFacility(new Restaurant(x, y), 250000);
    }

    public buildOffice(x: number, y: number): boolean {
        return this.buildFacility(new Office(x, y), 3000000);
    }

    public buildWarehouse(x: number, y: number): boolean {
        return this.buildFacility(new Warehouse(x, y), 10000000);
    }

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
        this._hasPlanetaryDefense = true;
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
}