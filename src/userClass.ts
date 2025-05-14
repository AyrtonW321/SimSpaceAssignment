import { Grid } from "./gridClass";
import { Residence, LuxuryResidence, ComfortableResidence, AffordableResidence } from "./residenceClass";
import { Facility } from "./facilityClass";

class User {
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
        
    }    
    
    private updatePowerStats(): void {
        this._totalPowerGenerated = this._grid.countFacilities("PowerPlant") * 100;
        
        this._totalPowerUsed = 0;
        for (let i = 0; i < this._grid.rows; i++) {
            for (let j = 0; j < this._grid.columns; j++) {
                const facility = this._grid.getFacility(i, j);
                if (facility && !facility.typeOf.includes("PowerPlant")) {
                    this._totalPowerUsed += facility.powerConsumption;
                }
            }
        }
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
        }
        if (Math.random() < 0.01) {
            // alien
            this._isGameOver = true;
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
        return this.buildFacility(new Warehouse(x, y), 50000000);
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

    private buildFacility(facility: Facility, cost: number): boolean {
        if (!this.canAfford(cost)) {
            return false;
        }
        if (this._grid.getFacility(facility.x, facility.y) !== null) {
            return false;
        }
        if (facility instanceof Residence) {
            if (!facility.locationCheck(this._grid)) {
                return false;
            }
        }
        this._userMoney -= cost;
        this._buildingsBuilt++;
        this._usedCoords.push([facility.x, facility.y]);
        return this._grid.addFacility(facility, facility.x, facility.y);
    }
}