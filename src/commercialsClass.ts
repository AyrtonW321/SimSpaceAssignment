// import classes
import { Grid } from "./gridClass.js";
import { Facility } from "./facilityClass.js";

// commercial facility class
export abstract class Commercials extends Facility {
    /**
     * Constructor to build the commercial buildings
     * @param x x coord
     * @param y y coord
     * @param buildCost build cost
     * @param powerConsumption power consumption
     * @param typeOf the type of building
     */
    constructor(
        x: number,
        y: number,
        buildCost: number,
        powerConsumption: number,
        typeOf: string
    ) {
        // constructor for the facility because the commercial buildings are extensions
        super(x, y, buildCost, powerConsumption, typeOf);
    }

    /**
     * gets the distance from a residential distance
     * @param grid input the pos on the grid
     * @returns returns the radius from the residential building and if it doesnt find one then it just returns 0
     */
    protected getResidenceDistance(grid: Grid): number {
        for (let radius = 1; radius <= 50; radius++) {
            if (grid.hasFacilityTypeInRadius(this.x, this.y, radius, "Residence")) {
                return radius;
            }
        }
        return 0;
    }

    /**
     * calculate the adjusted renenue and maintence cost
     * @param baseValue 
     * @param grid coord of the building
     * @return
     */
    protected calculateAdjustedValue(baseValue: number, grid: Grid): number {
        const distance = this.getResidenceDistance(grid);
        if (distance === 0) return 0;
        return distance <= 6 ? baseValue : (6 / distance) * baseValue;
    }

    // calls abstract methods
    public abstract calcMonthlyRevenue(grid?: Grid): number;
    public abstract calcMaintenanceCost(grid?: Grid): number;
    public abstract calcMonthlyPollution(): number;
}

// create the store class that extends from the commercial class
export class Store extends Commercials {
    // define the properties of the store
    private readonly _baseRevenue = 200000;
    private readonly _baseMaintenance = 50000;
    private readonly _basePollution = 500;

    /**
     * construct using the position on the grid
     * @param x 
     * @param y 
     */
    constructor(x: number, y: number) {
        // call the super constructor with the params of the commercial class
        super(x, y, 2000000, 5, "Store");
    }

    /**
     * public method to claculate the monthly revenue
     * @param grid the grid to check for the power and distance
     * @returns the monthly revenue based on the power and distance from residential buildings
     */
    public calcMonthlyRevenue(grid: Grid): number {
        return this.hasPower 
            ? this.calculateAdjustedValue(this._baseRevenue, grid) 
            : 0;
    }

    /**
     * public method to calculate the maintenance cost
     * @param grid the grid to check for the maintance cost
     * @returns returns the maintenance cost based on the distance from residential buildings
     */
    public calcMaintenanceCost(grid: Grid): number {
        return this.calculateAdjustedValue(this._baseMaintenance, grid);
    }

    /**
     * public method to calculate the monthly pollution
     * @returns returns the base pollution value
     */
    public calcMonthlyPollution(): number {
        return this._basePollution;
    }
}

// create the restaurant class that extends from the commercial class
export class Restaurant extends Commercials {
    // define the properties of the restaurant
    private readonly _baseRevenue = 10000;
    private readonly _baseMaintenance = 5000;
    private readonly _basePollution = 300;

    // constructor using the position on the grid
    constructor(x: number, y: number) {
        // call super with the params of the commercial class
        super(x, y, 250000, 5, "Restaurant");
    }

    /**
     * public method to claculate the monthly revenue
     * @param grid the grid to check for the power and distance
     * @returns the monthly revenue based on the power and distance from residential buildings
     */
    public calcMonthlyRevenue(grid: Grid): number {
        return this.hasPower 
            ? this.calculateAdjustedValue(this._baseRevenue, grid) 
            : 0;
    }

    /**
     * public method to calculate the maintenance cost
     * @param grid the grid to check for the maintance cost
     * @returns returns the maintenance cost based on the distance from residential buildings
     */
    public calcMaintenanceCost(grid: Grid): number {
        return this.calculateAdjustedValue(this._baseMaintenance, grid);
    }

    /**
     * public method to calculate the monthly pollution
     * @returns returns the base pollution value
     */
    public calcMonthlyPollution(): number {
        return this._basePollution;
    }
}

// create the office class that extends from the commercial class
export class Office extends Commercials {
    // define the properties of the office
    private readonly _baseRevenue = 20000;
    private readonly _baseMaintenance = 5000;
    private readonly _basePollution = 800;

    /**
     * construct using the position on the grid
     * @param x 
     * @param y 
     */
    constructor(x: number, y: number) {
        super(x, y, 3000000, 15, "Office");
    }

    /**
     * public method to claculate the monthly revenue
     * @param grid the grid to check for the power and distance
     * @returns the monthly revenue based on the power and distance from residential buildings
     */
    public calcMonthlyRevenue(grid: Grid): number {
        return this.hasPower 
            ? this.calculateAdjustedValue(this._baseRevenue, grid) 
            : 0;
    }

    /**
     * public method to calculate the maintenance cost
     * @param grid the grid to check for the maintance cost
     * @returns returns the maintenance cost based on the distance from residential buildings
     */
    public calcMaintenanceCost(grid: Grid): number {
        return this.calculateAdjustedValue(this._baseMaintenance, grid);
    }

    /**
     * public method to calculate the monthly pollution
     * @returns returns the base pollution value
     */
    public calcMonthlyPollution(): number {
        return this._basePollution;
    }
}