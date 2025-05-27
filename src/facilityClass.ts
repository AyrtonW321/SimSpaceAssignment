// import the grid class
import { Grid } from "./gridClass.js";

/**
 * Abstract base class for all facility types
 * Defines common properties and methods for all facilities
 */
export abstract class Facility {
    protected _x: number = 0;
    protected _y: number = 0;
    protected _buildCost: number = 0;
    protected _powerConsumption: number = 0;
    protected _typeOf: string;
    protected _monthsSinceBuilt: number = 0;
    protected _hasPower: boolean = false;

    /**
     * Constructs a new Facility
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
        this._x = x;
        this._y = y;
        this._buildCost = buildCost;
        this._powerConsumption = powerConsumption;
        this._typeOf = typeOf;
    }

    // Getters for all properties
    public get x(): number {
        return this._x;
    }
    public get y(): number {
        return this._y;
    }
    public get buildCost(): number {
        return this._buildCost;
    }
    public get powerConsumption(): number {
        return this._powerConsumption;
    }
    public get typeOf(): string {
        return this._typeOf;
    }
    public get monthsSinceBuilt(): number {
        return this._monthsSinceBuilt;
    }
    public get hasPower(): boolean {
        return this._hasPower;
    }

    // Abstract methods that must be implemented by subclasses
    abstract calcMonthlyRevenue(grid?: Grid): number;
    abstract calcMaintenanceCost(grid?: Grid): number;
    abstract calcMonthlyPollution(): number;

    /**
     * Increments the months since the facility was built
     */
    public incrementMonths(): void {
        this._monthsSinceBuilt++;
    }

    /**
     * Updates the power status of the facility
     * @param hasPower whether the facility has power
     */
    public updatePowerStatus(hasPower: boolean): void {
        this._hasPower = hasPower;
    }
}