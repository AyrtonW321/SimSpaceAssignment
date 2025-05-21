import { Facility } from "./facilityClass.js";

export class PlanetaryDefense extends Facility {
    constructor(x: number, y: number) {
        super(x, y, 1000000000000, 0, "PlanetaryDefense");
    }

    public calcMonthlyRevenue(): number {
        return 0;
    }

    public calcMaintenanceCost(): number {
        return 0;
    }

    public calcMonthlyPollution(): number {
        return 0;
    }
}