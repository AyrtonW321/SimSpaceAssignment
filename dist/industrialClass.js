import { Facility } from "./facilityClass.js";
export class IndustrialFacility extends Facility {
    constructor(x, y, buildCost, powerConsumption, typeOf) {
        super(x, y, buildCost, powerConsumption, typeOf);
    }
    isNearPowerPlant(grid) {
        return grid.hasFacilityTypeInRadius(this.x, this.y, 6, "PowerPlant");
    }
}
export class Factory extends IndustrialFacility {
    constructor(x, y) {
        super(x, y, 50000000, 50, "Factory");
    }
    calcMonthlyRevenue() {
        if (!this.hasPower || this.monthsSinceBuilt === 0)
            return 0;
        return Math.min(this.monthsSinceBuilt, 5) * 1000000;
    }
    calcMaintenanceCost() {
        return Math.min(this.monthsSinceBuilt, 5) * 100000;
    }
    calcMonthlyPollution() {
        return 20000;
    }
    canBeBuilt(grid) {
        return this.isNearPowerPlant(grid);
    }
}
export class Warehouse extends IndustrialFacility {
    constructor(x, y) {
        super(x, y, 10000000, 10, "Warehouse");
    }
    calcMonthlyRevenue() {
        return 0;
    }
    calcMaintenanceCost() {
        return 5000000;
    }
    calcMonthlyPollution() {
        return 0;
    }
    canBeBuilt(grid) {
        return this.isNearPowerPlant(grid);
    }
    isBoostingFactory(grid) {
        return grid.hasFacilityTypeInRadius(this.x, this.y, 5, "Factory");
    }
}
export class EnvironmentalFacility extends IndustrialFacility {
    constructor(x, y) {
        super(x, y, 200000000, 75, "EnvironmentalFacility");
        this._pollutionReductionRadius = 10;
        this._maxPollutionReduction = 30000;
    }
    calcMonthlyRevenue() {
        return 0;
    }
    calcMaintenanceCost() {
        return 3000000;
    }
    calcMonthlyPollution() {
        return 0;
    }
    canBeBuilt(grid) {
        return this.isNearPowerPlant(grid);
    }
    get pollutionReductionRadius() {
        return this._pollutionReductionRadius;
    }
    get maxPollutionReduction() {
        return this._maxPollutionReduction;
    }
}
//# sourceMappingURL=industrialClass.js.map