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
        if (!this.hasPower)
            return 0;
        if (this.monthsSinceBuilt === 0)
            return 0;
        if (this.monthsSinceBuilt === 1)
            return 1000000;
        if (this.monthsSinceBuilt === 2)
            return 2000000;
        if (this.monthsSinceBuilt === 3)
            return 3000000;
        if (this.monthsSinceBuilt === 4)
            return 4000000;
        return 5000000;
    }
    calcMaintenanceCost() {
        if (this.monthsSinceBuilt === 0)
            return 0;
        if (this.monthsSinceBuilt === 1)
            return 100000;
        if (this.monthsSinceBuilt === 2)
            return 200000;
        if (this.monthsSinceBuilt === 3)
            return 300000;
        if (this.monthsSinceBuilt === 4)
            return 400000;
        return 500000;
    }
    calcMonthlyPollution() {
        return 20000; // Fixed pollution amount
    }
    canBeBuilt(grid) {
        return this.isNearPowerPlant(grid);
    }
}
/* MAKE LATER
export class Warehouse extends IndustrialFacility {
    constructor(x: number, y: number) {
    }

    public calcMonthlyRevenue(): number {
        if (!this.hasPower) return 0;
    }

    public calcMaintenanceCost(): number {
    }

    public calcMonthlyPollution(): number {
    }

    public canBeBuilt(grid: Grid): boolean {
    }
}
*/
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