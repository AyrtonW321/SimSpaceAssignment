import { Facility } from "./facilityClass";
import { Grid } from "./gridClass";

export abstract class Residence extends Facility {
    protected _happyPopulation: number = 0;
    protected _contentPopulation: number = 0;
    protected _currPopulation: number = 0;
    protected _currMaxPopulation: number = 0;
    protected _monthsSinceBuilt: number = 0;

    // Getters
    public get happyPopulation(): number {
        return this._happyPopulation;
    }
    public get contentPopulation(): number {
        return this._contentPopulation;
    }
    public get currPopulation(): number {
        return this._currPopulation;
    }
    public get currMaxPopulation(): number {
        return this._currMaxPopulation;
    }
    public get monthsSinceBuilt(): number {
        return this._monthsSinceBuilt;
    }

    public hasRequiredServices(grid: Grid): boolean {
        const essentialServices = [
            "EducationCenter",
            "MedicalCenter",
            "EmergencyServices",
            "GovernmentFacility",
            "EnvironmentalFacility",
        ];
        return essentialServices.every((service) =>
            grid.hasFacilityTypeInRadius(this.x, this.y, 8, service)
        );
    }

    public hasRequiredAmenities(grid: Grid): boolean {
        return (
            grid.hasFacilityTypeInRadius(this.x, this.y, 5, "Store") &&
            grid.hasFacilityTypeInRadius(this.x, this.y, 3, "Restaurant")
        );
    }

    public canBeBuilt(grid: Grid): boolean {
        return (
            this.hasRequiredServices(grid) && this.hasRequiredAmenities(grid)
        );
    }

    abstract calcMonthlyRevenue(): number;
    abstract calcMonthlyPollution(): number;
    abstract updatePopulation(grid: Grid): void;

    constructor(
        x: number,
        y: number,
        buildCost: number,
        powerConsumption: number,
        typeOf: string
    ) {
        super(x, y, buildCost, powerConsumption, typeOf);
    }

    protected growPopulation(): void {
        if (this._currPopulation < this._currMaxPopulation) {
            const growthAmount = Math.floor(this._currMaxPopulation * 0.1);
            this._currPopulation = Math.min(
                this._currPopulation + growthAmount,
                this._currMaxPopulation
            );
        }
    }

    protected updatePopulationCategories(happyRatio: number): void {
        this._happyPopulation = Math.floor(this._currPopulation * happyRatio);
        this._contentPopulation = this._currPopulation - this._happyPopulation;
    }
}

export class LuxuryResidence extends Residence {
    private readonly _absoluteMaxPopulation: number = 10000;
    private _hasStore: boolean = false;
    private _hasRestaurant: boolean = false;

    constructor(x: number, y: number) {
        super(x, y, 1000000000, 100, "LuxuryResidence");
        this._currMaxPopulation = 0;
    }

    public calcMonthlyRevenue(): number {
        if (!this.hasPower) return 0;
        const thousandsOfResidents = Math.floor(this.currPopulation / 1000);
        return thousandsOfResidents * 15000000;
    }

    public calcMaintenanceCost(): number {
        const baseCost = 10000000;
        const perThousandCost =
            Math.floor(this.currPopulation / 1000) * 1000000;
        return baseCost + perThousandCost;
    }

    public calcMonthlyPollution(): number {
        return Math.floor(this.currPopulation / 1000) * 500;
    }

    public updatePopulation(grid: Grid): void {
        this._hasStore = grid.hasFacilityTypeInRadius(
            this.x,
            this.y,
            5,
            "Store"
        );
        this._hasRestaurant = grid.hasFacilityTypeInRadius(
            this.x,
            this.y,
            3,
            "Restaurant"
        );

        if (this._hasStore && this._hasRestaurant) {
            this._currMaxPopulation = this._absoluteMaxPopulation;
        } else {
            this._currMaxPopulation = 5000;
        }

        if (
            super.hasRequiredServices(grid) &&
            this._currPopulation < this._currMaxPopulation
        ) {
            const monthlyGrowth = Math.floor(this._currMaxPopulation * 0.1);
            this._currPopulation = Math.min(
                this._currPopulation + monthlyGrowth,
                this._currMaxPopulation
            );

            this._happyPopulation = Math.floor(this._currPopulation * 0.5);
            this._contentPopulation =
                this._currPopulation - this._happyPopulation;
        }

        this.incrementMonths;
    }

    public get luxuryAmenitiesStatus(): boolean {
        return this._hasStore && this._hasRestaurant;
    }

    public get luxuryAmenitiesStatusDescription(): string {
        return `Store: ${this._hasStore ? "✅" : "❌"}, Restaurant: ${
            this._hasRestaurant ? "✅" : "❌"
        }`;
    }
}

export class ComfortableResidence extends Residence {
    private readonly _absoluteMaxPopulation: number = 15000;
    private _hasStore: boolean = false;
    private _hasRestaurant: boolean = false;

    constructor(x: number, y: number) {
        super(x, y, 500000000, 50, "ComfortableResidence");
        this._currMaxPopulation = 0;
    }

    public calcMonthlyRevenue(): number {
        if (!this.hasPower) return 0;
        const thousandsOfResidents = Math.floor(this.currPopulation / 1000);
        return thousandsOfResidents * 1000000;
    }

    public calcMaintenanceCost(): number {
        const baseCost = 40000;
        const perThousandCost = Math.floor(this.currPopulation / 1000) * 50000;
        return baseCost + perThousandCost;
    }

    public calcMonthlyPollution(): number {
        return Math.floor(this.currPopulation / 1000) * 50;
    }

    public updatePopulation(grid: Grid): void {
        this._hasStore = grid.hasFacilityTypeInRadius(
            this.x,
            this.y,
            5,
            "Store"
        );
        this._hasRestaurant = grid.hasFacilityTypeInRadius(
            this.x,
            this.y,
            3,
            "Restaurant"
        );

        this._currMaxPopulation = this._absoluteMaxPopulation;

        if (
            super.hasRequiredServices(grid) &&
            this._currPopulation < this._currMaxPopulation
        ) {
            const monthlyGrowth = Math.floor(this._currMaxPopulation * 0.1);
            this._currPopulation = Math.min(
                this._currPopulation + monthlyGrowth,
                this._currMaxPopulation
            );

            this._happyPopulation = Math.floor(this._currPopulation * 0.25);
            this._contentPopulation =
                this._currPopulation - this._happyPopulation;
        }

        this.incrementMonths();
    }

    public get comfortableAmenitiesStatus(): boolean {
        return this._hasStore && this._hasRestaurant;
    }

    public get comfortableAmenitiesStatusDescription(): string {
        return `Store: ${this._hasStore ? "✅" : "❌"}, Restaurant: ${
            this._hasRestaurant ? "✅" : "❌"
        }`;
    }
}

export class AffordableResidence extends Residence {
    private readonly _absoluteMaxPopulation: number = 25000;
    private _hasStore: boolean = false;
    private _hasRestaurant: boolean = false;

    constructor(x: number, y: number) {
        super(x, y, 50000000, 25, "AffordableResidence");
        this._currMaxPopulation = 0;
    }

    public calcMonthlyRevenue(): number {
        if (!this.hasPower) return 0;
        const thousandsOfResidents = Math.floor(this.currPopulation / 1000);
        return thousandsOfResidents * 10000;
    }

    public calcMaintenanceCost(): number {
        const baseCost = 8000;
        const perThousandCost = Math.floor(this.currPopulation / 1000) * 2000;
        return baseCost + perThousandCost;
    }

    public calcMonthlyPollution(): number {
        return Math.floor(this.currPopulation / 1000) * 10;
    }

    public updatePopulation(grid: Grid): void {
        this._hasStore = grid.hasFacilityTypeInRadius(
            this.x,
            this.y,
            5,
            "Store"
        );
        this._hasRestaurant = grid.hasFacilityTypeInRadius(
            this.x,
            this.y,
            3,
            "Restaurant"
        );

        this._currMaxPopulation = this._absoluteMaxPopulation;

        if (
            super.hasRequiredServices(grid) &&
            this._currPopulation < this._currMaxPopulation
        ) {
            const monthlyGrowth = Math.floor(this._currMaxPopulation * 0.1);
            this._currPopulation = Math.min(
                this._currPopulation + monthlyGrowth,
                this._currMaxPopulation
            );

            this._happyPopulation = Math.floor(this._currPopulation * 0.1);
            this._contentPopulation =
                this._currPopulation - this._happyPopulation;
        }

        this.incrementMonths();
    }

    public get affordableAmenitiesStatus(): boolean {
        return this._hasStore && this._hasRestaurant;
    }

    public get affordableAmenitiesStatusDescription(): string {
        return `Store: ${this._hasStore ? "✅" : "❌"}, Restaurant: ${
            this._hasRestaurant ? "✅" : "❌"
        }`;
    }
}
