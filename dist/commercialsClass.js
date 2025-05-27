import { Facility } from "./facilityClass.js";
// commercial facility class
export class Commercials extends Facility {
    /**
     * Constructor to build the commercial buildings
     * @param x x coord
     * @param y y coord
     * @param buildCost build cost
     * @param powerConsumption power consumption
     * @param typeOf the type of building
     */
    constructor(x, y, buildCost, powerConsumption, typeOf) {
        // constructor for the facility because the commercial buildings are extensions
        super(x, y, buildCost, powerConsumption, typeOf);
    }
    /**
     * gets the distance from a residential distance
     * @param grid input the pos on the grid
     * @returns returns the radius from the residential building and if it doesnt find one then it just returns 0
     */
    getResidenceDistance(grid) {
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
    calculateAdjustedValue(baseValue, grid) {
        const distance = this.getResidenceDistance(grid);
        if (distance === 0)
            return 0;
        return distance <= 6 ? baseValue : (6 / distance) * baseValue;
    }
}
// create the store class that extends from the commercial class
export class Store extends Commercials {
    /**
     * construct using the position on the grid
     * @param x
     * @param y
     */
    constructor(x, y) {
        // call the super constructor with the params of the commercial class
        super(x, y, 2000000, 5, "Store");
        // define the properties of the store
        this._baseRevenue = 200000;
        this._baseMaintenance = 50000;
        this._basePollution = 500;
    }
    /**
     * public method to claculate the monthly revenue
     * @param grid the grid to check for the power and distance
     * @returns the monthly revenue based on the power and distance from residential buildings
     */
    calcMonthlyRevenue(grid) {
        return this.hasPower
            ? this.calculateAdjustedValue(this._baseRevenue, grid)
            : 0;
    }
    /**
     * public method to calculate the maintenance cost
     * @param grid the grid to check for the maintance cost
     * @returns returns the maintenance cost based on the distance from residential buildings
     */
    calcMaintenanceCost(grid) {
        return this.calculateAdjustedValue(this._baseMaintenance, grid);
    }
    /**
     * public method to calculate the monthly pollution
     * @returns returns the base pollution value
     */
    calcMonthlyPollution() {
        return this._basePollution;
    }
}
// create the restaurant class that extends from the commercial class
export class Restaurant extends Commercials {
    // constructor using the position on the grid
    constructor(x, y) {
        // call super with the params of the commercial class
        super(x, y, 250000, 5, "Restaurant");
        // define the properties of the restaurant
        this._baseRevenue = 10000;
        this._baseMaintenance = 5000;
        this._basePollution = 300;
    }
    /**
     * public method to claculate the monthly revenue
     * @param grid the grid to check for the power and distance
     * @returns the monthly revenue based on the power and distance from residential buildings
     */
    calcMonthlyRevenue(grid) {
        return this.hasPower
            ? this.calculateAdjustedValue(this._baseRevenue, grid)
            : 0;
    }
    /**
     * public method to calculate the maintenance cost
     * @param grid the grid to check for the maintance cost
     * @returns returns the maintenance cost based on the distance from residential buildings
     */
    calcMaintenanceCost(grid) {
        return this.calculateAdjustedValue(this._baseMaintenance, grid);
    }
    /**
     * public method to calculate the monthly pollution
     * @returns returns the base pollution value
     */
    calcMonthlyPollution() {
        return this._basePollution;
    }
}
// create the office class that extends from the commercial class
export class Office extends Commercials {
    /**
     * construct using the position on the grid
     * @param x
     * @param y
     */
    constructor(x, y) {
        super(x, y, 3000000, 15, "Office");
        // define the properties of the office
        this._baseRevenue = 20000;
        this._baseMaintenance = 5000;
        this._basePollution = 800;
    }
    /**
     * public method to claculate the monthly revenue
     * @param grid the grid to check for the power and distance
     * @returns the monthly revenue based on the power and distance from residential buildings
     */
    calcMonthlyRevenue(grid) {
        return this.hasPower
            ? this.calculateAdjustedValue(this._baseRevenue, grid)
            : 0;
    }
    /**
     * public method to calculate the maintenance cost
     * @param grid the grid to check for the maintance cost
     * @returns returns the maintenance cost based on the distance from residential buildings
     */
    calcMaintenanceCost(grid) {
        return this.calculateAdjustedValue(this._baseMaintenance, grid);
    }
    /**
     * public method to calculate the monthly pollution
     * @returns returns the base pollution value
     */
    calcMonthlyPollution() {
        return this._basePollution;
    }
}
//# sourceMappingURL=commercialsClass.js.map