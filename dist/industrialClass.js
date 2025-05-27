// import required classes
import { Facility } from "./facilityClass.js";
/**
 * Abstract base class for industrial facilities
 * Extends the base Facility class
 */
export class IndustrialFacility extends Facility {
    /**
     * Constructs a new Industrial Facility
     * @param x x-coordinate on grid
     * @param y y-coordinate on grid
     * @param buildCost construction cost
     * @param powerConsumption power required to operate
     * @param typeOf type identifier string
     */
    constructor(x, y, buildCost, powerConsumption, typeOf) {
        super(x, y, buildCost, powerConsumption, typeOf);
    }
    /**
     * Checks if facility is near a power plant
     * @param grid reference to game grid
     * @returns true if power plant is within 6 units
     */
    isNearPowerPlant(grid) {
        return grid.hasFacilityTypeInRadius(this.x, this.y, 6, "PowerPlant");
    }
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
    constructor(x, y) {
        super(x, y, 50000000, 50, "Factory");
    }
    /**
     * Calculates monthly revenue
     * @returns revenue based on months since built
     */
    calcMonthlyRevenue() {
        if (!this.hasPower || this.monthsSinceBuilt === 0)
            return 0;
        return Math.min(this.monthsSinceBuilt, 5) * 1000000;
    }
    /**
     * Calculates maintenance cost
     * @returns cost based on months since built
     */
    calcMaintenanceCost() {
        return Math.min(this.monthsSinceBuilt, 5) * 100000;
    }
    /**
     * Calculates pollution output
     * @returns fixed pollution amount
     */
    calcMonthlyPollution() {
        return 20000;
    }
    /**
     * Checks if factory can be built
     * @param grid reference to game grid
     * @returns true if near power plant
     */
    canBeBuilt(grid) {
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
    constructor(x, y) {
        super(x, y, 10000000, 10, "Warehouse");
    }
    /**
     * Calculates monthly revenue
     * @returns Always returns 0 as warehouses don't generate direct revenue
     */
    calcMonthlyRevenue() {
        return 0;
    }
    /**
     * Calculates maintenance cost
     * @returns Fixed maintenance cost
     */
    calcMaintenanceCost() {
        return 5000000;
    }
    /**
     * Calculates pollution output
     * @returns Always returns 0 as warehouses don't pollute
     */
    calcMonthlyPollution() {
        return 0;
    }
    /**
     * Checks if warehouse can be built
     * @param grid reference to game grid
     * @returns true if near power plant
     */
    canBeBuilt(grid) {
        return this.isNearPowerPlant(grid);
    }
    /**
     * Checks if warehouse is boosting nearby factories
     * @param grid reference to game grid
     * @returns true if factory is within 5 units
     */
    isBoostingFactory(grid) {
        return grid.hasFacilityTypeInRadius(this.x, this.y, 5, "Factory");
    }
}
/**
 * Environmental Facility class - reduces pollution
 * Extends IndustrialFacility
 */
export class EnvironmentalFacility extends IndustrialFacility {
    /**
     * Constructs a new Environmental Facility
     * @param x x-coordinate on grid
     * @param y y-coordinate on grid
     */
    constructor(x, y) {
        super(x, y, 200000000, 75, "EnvironmentalFacility");
        this._pollutionReductionRadius = 10;
        this._maxPollutionReduction = 30000;
    }
    /**
     * Calculates monthly revenue
     * @returns Always returns 0 as environmental facilities don't generate revenue
     */
    calcMonthlyRevenue() {
        return 0;
    }
    /**
     * Calculates maintenance cost
     * @returns Fixed maintenance cost
     */
    calcMaintenanceCost() {
        return 3000000;
    }
    /**
     * Calculates pollution output
     * @returns Always returns 0 as environmental facilities don't pollute
     */
    calcMonthlyPollution() {
        return 0;
    }
    /**
     * Checks if facility can be built
     * @param grid reference to game grid
     * @returns true if near power plant
     */
    canBeBuilt(grid) {
        return this.isNearPowerPlant(grid);
    }
    /**
     * Gets pollution reduction radius
     * @returns radius in grid units
     */
    get pollutionReductionRadius() {
        return this._pollutionReductionRadius;
    }
    /**
     * Gets maximum pollution reduction capacity
     * @returns max pollution reduction amount
     */
    get maxPollutionReduction() {
        return this._maxPollutionReduction;
    }
}
//# sourceMappingURL=industrialClass.js.map