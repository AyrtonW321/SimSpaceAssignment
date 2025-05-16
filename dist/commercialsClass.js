import { Facility } from "./facilityClass";
export class Commercials extends Facility {
    constructor(x, y, buildCost, powerConsumption, typeOf) {
        super(x, y, buildCost, powerConsumption, typeOf);
    }
    getResidenceDistance(grid) {
        for (let radius = 1; radius <= 50; radius++) {
            if (grid.hasFacilityTypeInRadius(this.x, this.y, radius, "Residence")) {
                return radius;
            }
        }
        return 0;
    }
    calculateAdjustedValue(baseValue, grid) {
        const distance = this.getResidenceDistance(grid);
        if (distance === 0)
            return 0;
        return distance <= 6 ? baseValue : (6 / distance) * baseValue;
    }
}
export class Store extends Commercials {
    constructor(x, y) {
        super(x, y, 2000000, 5, "Store");
        this._baseRevenue = 200000;
        this._baseMaintenance = 50000;
        this._basePollution = 500;
    }
    calcMonthlyRevenue(grid) {
        return this.hasPower
            ? this.calculateAdjustedValue(this._baseRevenue, grid)
            : 0;
    }
    calcMaintenanceCost(grid) {
        return this.calculateAdjustedValue(this._baseMaintenance, grid);
    }
    calcMonthlyPollution() {
        return this._basePollution;
    }
}
export class Restaurant extends Commercials {
    constructor(x, y) {
        super(x, y, 250000, 5, "Restaurant");
        this._baseRevenue = 10000;
        this._baseMaintenance = 5000;
        this._basePollution = 300;
    }
    calcMonthlyRevenue(grid) {
        return this.hasPower
            ? this.calculateAdjustedValue(this._baseRevenue, grid)
            : 0;
    }
    calcMaintenanceCost(grid) {
        return this.calculateAdjustedValue(this._baseMaintenance, grid);
    }
    calcMonthlyPollution() {
        return this._basePollution;
    }
}
export class Office extends Commercials {
    constructor(x, y) {
        super(x, y, 3000000, 15, "Office");
        this._baseRevenue = 20000;
        this._baseMaintenance = 5000;
        this._basePollution = 800;
    }
    calcMonthlyRevenue(grid) {
        return this.hasPower
            ? this.calculateAdjustedValue(this._baseRevenue, grid)
            : 0;
    }
    calcMaintenanceCost(grid) {
        return this.calculateAdjustedValue(this._baseMaintenance, grid);
    }
    calcMonthlyPollution() {
        return this._basePollution;
    }
}
//# sourceMappingURL=commercialsClass.js.map