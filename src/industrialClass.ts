import { Facility } from "./facilityClass.js";
import { Grid } from "./gridClass.js";

export abstract class IndustrialFacility extends Facility {
    constructor(
        x: number,
        y: number,
        buildCost: number,
        powerConsumption: number,
        typeOf: string
    ) {
        super(x, y, buildCost, powerConsumption, typeOf);
    }

    public isNearPowerPlant(grid: Grid): boolean {
        return grid.hasFacilityTypeInRadius(this.x, this.y, 6, "PowerPlant");
    }

    public abstract calcMonthlyRevenue(): number;
    public abstract calcMaintenanceCost(): number;
    public abstract calcMonthlyPollution(): number;
}

export class Factory extends IndustrialFacility {
    constructor(x: number, y: number) {
        super(x, y, 50000000, 50, "Factory");
    }

    public calcMonthlyRevenue(): number {
        if (!this.hasPower) return 0;
        
        if (this.monthsSinceBuilt === 0) return 0;
        if (this.monthsSinceBuilt === 1) return 1000000;
        if (this.monthsSinceBuilt === 2) return 2000000;
        if (this.monthsSinceBuilt === 3) return 3000000;
        if (this.monthsSinceBuilt === 4) return 4000000;
        return 5000000;
    }

    public calcMaintenanceCost(): number {
        if (this.monthsSinceBuilt === 0) return 0;
        if (this.monthsSinceBuilt === 1) return 100000;
        if (this.monthsSinceBuilt === 2) return 200000;
        if (this.monthsSinceBuilt === 3) return 300000;
        if (this.monthsSinceBuilt === 4) return 400000;
        return 500000;
    }

    public calcMonthlyPollution(): number {
        return 20000; // Fixed pollution amount
    }

    public canBeBuilt(grid: Grid): boolean {
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
    private readonly _pollutionReductionRadius: number = 10;
    private readonly _maxPollutionReduction: number = 30000;

    constructor(x: number, y: number) {
        super(x, y, 200000000, 75, "EnvironmentalFacility");
    }

    public calcMonthlyRevenue(): number {
        return 0;
    }

    public calcMaintenanceCost(): number {
        return 3000000;
    }

    public calcMonthlyPollution(): number {
        return 0;
    }

    public canBeBuilt(grid: Grid): boolean {
        return this.isNearPowerPlant(grid);
    }

    public get pollutionReductionRadius(): number {
        return this._pollutionReductionRadius;
    }
    public get maxPollutionReduction(): number {
        return this._maxPollutionReduction;
    }
}