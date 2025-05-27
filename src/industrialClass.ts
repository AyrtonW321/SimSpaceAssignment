// import required classes
import { Facility } from "./facilityClass.js";
import { Grid } from "./gridClass.js";

/**
 * Abstract base class for industrial facilities
 * Extends the base Facility class
 */
export abstract class IndustrialFacility extends Facility {
    /**
     * Constructs a new Industrial Facility
     * @param x x-coordinate on grid
     * @param y y-coordinate on grid
     * @param buildCost construction cost
     * @param powerConsumption power required to operate
     * @param typeOf type identifier string
     */
    constructor(
        x: number,
        y: number,
        buildCost: number,
        powerConsumption: number,
        typeOf: string
    ) {
        super(x, y, buildCost, powerConsumption, typeOf);
    }

    /**
     * Checks if facility is near a power plant
     * @param grid reference to game grid
     * @returns true if power plant is within 6 units
     */
    public isNearPowerPlant(grid: Grid): boolean {
        return grid.hasFacilityTypeInRadius(this.x, this.y, 6, "PowerPlant");
    }

    // Abstract methods that must be implemented by subclasses
    public abstract calcMonthlyRevenue(): number;
    public abstract calcMaintenanceCost(): number;
    public abstract calcMonthlyPollution(): number;
    public abstract canBeBuilt(grid: Grid): boolean;
}

/**
 * Factory class - produces goods and pollution
 * Extends IndustrialFacility
 */
export class Factory extends IndustrialFacility {
    /**
     * Constructs a new Factory
     * @param x x-coordinate on grid
     * @param y y-coordinate on grid
     */
    constructor(x: number, y: number) {
        super(x, y, 50000000, 50, "Factory");
    }

    /**
     * Calculates monthly revenue
     * @returns revenue based on months since built
     */
    public calcMonthlyRevenue(): number {
        if (!this.hasPower || this.monthsSinceBuilt === 0) return 0;
        return Math.min(this.monthsSinceBuilt, 5) * 1000000;
    }

    /**
     * Calculates maintenance cost
     * @returns cost based on months since built
     */
    public calcMaintenanceCost(): number {
        return Math.min(this.monthsSinceBuilt, 5) * 100000;
    }

    /**
     * Calculates pollution output
     * @returns fixed pollution amount
     */
    public calcMonthlyPollution(): number {
        return 20000;
    }

    /**
     * Checks if factory can be built
     * @param grid reference to game grid
     * @returns true if near power plant
     */
    public canBeBuilt(grid: Grid): boolean {
        return this.isNearPowerPlant(grid);
    }
}

/**
 * Warehouse class - supports factories
 * Extends IndustrialFacility
 */
export class Warehouse extends IndustrialFacility {
    /**
     * Constructs a new Warehouse
     * @param x x-coordinate on grid
     * @param y y-coordinate on grid
     */
    constructor(x: number, y: number) {
        super(x, y, 10000000, 10, "Warehouse");
    }

    /**
     * Calculates monthly revenue
     * @returns Always returns 0 as warehouses don't generate direct revenue
     */
    public calcMonthlyRevenue(): number {
        return 0;
    }

    /**
     * Calculates maintenance cost
     * @returns Fixed maintenance cost
     */
    public calcMaintenanceCost(): number {
        return 5000000;
    }

    /**
     * Calculates pollution output
     * @returns Always returns 0 as warehouses don't pollute
     */
    public calcMonthlyPollution(): number {
        return 0;
    }

    /**
     * Checks if warehouse can be built
     * @param grid reference to game grid
     * @returns true if near power plant
     */
    public canBeBuilt(grid: Grid): boolean {
        return this.isNearPowerPlant(grid);
    }

    /**
     * Checks if warehouse is boosting nearby factories
     * @param grid reference to game grid
     * @returns true if factory is within 5 units
     */
    public isBoostingFactory(grid: Grid): boolean {
        return grid.hasFacilityTypeInRadius(this.x, this.y, 5, "Factory");
    }
}

/**
 * Environmental Facility class - reduces pollution
 * Extends IndustrialFacility
 */
export class EnvironmentalFacility extends IndustrialFacility {
    private readonly _pollutionReductionRadius: number = 10;
    private readonly _maxPollutionReduction: number = 30000;

    /**
     * Constructs a new Environmental Facility
     * @param x x-coordinate on grid
     * @param y y-coordinate on grid
     */
    constructor(x: number, y: number) {
        super(x, y, 200000000, 75, "EnvironmentalFacility");
    }

    /**
     * Calculates monthly revenue
     * @returns Always returns 0 as environmental facilities don't generate revenue
     */
    public calcMonthlyRevenue(): number {
        return 0;
    }

    /**
     * Calculates maintenance cost
     * @returns Fixed maintenance cost
     */
    public calcMaintenanceCost(): number {
        return 3000000;
    }

    /**
     * Calculates pollution output
     * @returns Always returns 0 as environmental facilities don't pollute
     */
    public calcMonthlyPollution(): number {
        return 0;
    }

    /**
     * Checks if facility can be built
     * @param grid reference to game grid
     * @returns true if near power plant
     */
    public canBeBuilt(grid: Grid): boolean {
        return this.isNearPowerPlant(grid);
    }

    /**
     * Gets pollution reduction radius
     * @returns radius in grid units
     */
    public get pollutionReductionRadius(): number {
        return this._pollutionReductionRadius;
    }
    
    /**
     * Gets maximum pollution reduction capacity
     * @returns max pollution reduction amount
     */
    public get maxPollutionReduction(): number {
        return this._maxPollutionReduction;
    }
}