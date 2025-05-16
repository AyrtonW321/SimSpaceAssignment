import { Grid } from "./gridClass";
import { Facility } from "./facilityClass";

export abstract class Commercials extends Facility {
    constructor(
        x: number,
        y: number,
        buildCost: number,
        powerConsumption: number,
        typeOf: string
    ) {
        super(x, y, buildCost, powerConsumption, typeOf);
    }

    protected getResidenceDistance(grid: Grid): number {
        for (let radius = 1; radius <= 50; radius++) {
            if (grid.hasFacilityTypeInRadius(this.x, this.y, radius, "Residence")) {
                return radius;
            }
        }
        return 0;
    }

    protected calculateAdjustedValue(baseValue: number, grid: Grid): number {
        const distance = this.getResidenceDistance(grid);
        if (distance === 0) return 0;
        return distance <= 6 ? baseValue : (6 / distance) * baseValue;
    }

    public abstract calcMonthlyRevenue(grid?: Grid): number;
    public abstract calcMaintenanceCost(grid?: Grid): number;
    public abstract calcMonthlyPollution(): number;
}

export class Store extends Commercials {
    private readonly _baseRevenue = 200000;
    private readonly _baseMaintenance = 50000;
    private readonly _basePollution = 500;

    constructor(x: number, y: number) {
        super(x, y, 2000000, 5, "Store");
    }

    public calcMonthlyRevenue(grid: Grid): number {
        return this.hasPower 
            ? this.calculateAdjustedValue(this._baseRevenue, grid) 
            : 0;
    }

    public calcMaintenanceCost(grid: Grid): number {
        return this.calculateAdjustedValue(this._baseMaintenance, grid);
    }

    public calcMonthlyPollution(): number {
        return this._basePollution;
    }
}

export class Restaurant extends Commercials {
    private readonly _baseRevenue = 10000;
    private readonly _baseMaintenance = 5000;
    private readonly _basePollution = 300;

    constructor(x: number, y: number) {
        super(x, y, 250000, 5, "Restaurant");
    }

    public calcMonthlyRevenue(grid: Grid): number {
        return this.hasPower 
            ? this.calculateAdjustedValue(this._baseRevenue, grid) 
            : 0;
    }

    public calcMaintenanceCost(grid: Grid): number {
        return this.calculateAdjustedValue(this._baseMaintenance, grid);
    }

    public calcMonthlyPollution(): number {
        return this._basePollution;
    }
}

export class Office extends Commercials {
    private readonly _baseRevenue = 20000;
    private readonly _baseMaintenance = 5000;
    private readonly _basePollution = 800;

    constructor(x: number, y: number) {
        super(x, y, 3000000, 15, "Office");
    }

    public calcMonthlyRevenue(grid: Grid): number {
        return this.hasPower 
            ? this.calculateAdjustedValue(this._baseRevenue, grid) 
            : 0;
    }

    public calcMaintenanceCost(grid: Grid): number {
        return this.calculateAdjustedValue(this._baseMaintenance, grid);
    }

    public calcMonthlyPollution(): number {
        return this._basePollution;
    }
}