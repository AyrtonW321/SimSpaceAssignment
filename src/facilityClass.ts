import { Grid } from "./gridClass.js";

export abstract class Facility {
    protected _x: number = 0;
    protected _y: number = 0;
    protected _buildCost: number = 0;
    protected _powerConsumption: number = 0;
    protected _typeOf: string;
    protected _monthsSinceBuilt: number = 0;
    protected _hasPower: boolean = false;

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

    abstract calcMonthlyRevenue(grid?: Grid): number;
    abstract calcMaintenanceCost(grid?: Grid): number;
    abstract calcMonthlyPollution(): number;

    public incrementMonths(): void {
        this._monthsSinceBuilt++;
    }

    public updatePowerStatus(hasPower: boolean): void {
        this._hasPower = hasPower;
    }
}
