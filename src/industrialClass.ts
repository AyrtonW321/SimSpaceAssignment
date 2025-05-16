import { Facility } from "./facilityClass";
import { Grid } from "./gridClass";

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

    public abstract canBeBuilt(grid: Grid): boolean;
}

export class Factory extends IndustrialFacility {
    constructor(x: number, y: number) {
        super(x, y, 50000000, 50, "Factory");
    }

    public calcMonthlyRevenue(): number {
        if (!this.hasPower || this.monthsSinceBuilt === 0) return 0;
        return Math.min(this.monthsSinceBuilt, 5) * 1000000;
    }

    public calcMaintenanceCost(): number {
        return Math.min(this.monthsSinceBuilt, 5) * 100000;
    }

    public calcMonthlyPollution(): number {
        return 20000;
    }

    public canBeBuilt(grid: Grid): boolean {
        return this.isNearPowerPlant(grid);
    }
}

export class Warehouse extends IndustrialFacility {
    constructor(x: number, y: number) {
        super(x, y, 10000000, 10, "Warehouse");
    }

    public calcMonthlyRevenue(): number {
        return 0;
    }

    public calcMaintenanceCost(): number {
        return 5000000;
    }

    public calcMonthlyPollution(): number {
        return 0;
    }

    public canBeBuilt(grid: Grid): boolean {
        return this.isNearPowerPlant(grid);
    }

    public isBoostingFactory(grid: Grid): boolean {
        return grid.hasFacilityTypeInRadius(this.x, this.y, 5, "Factory");
    }
}

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
