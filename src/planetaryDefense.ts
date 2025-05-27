// import the facility class
import { Facility } from "./facilityClass.js";

/**
 * Planetary Defense facility class
 * Provides protection against disasters
 * Extends the base Facility class
 */
export class PlanetaryDefense extends Facility {
    /**
     * Constructs a Planetary Defense facility
     * @param x x-coordinate on grid
     * @param y y-coordinate on grid
     */
    constructor(x: number, y: number) {
        super(x, y, 1000000000000, 0, "PlanetaryDefense");
    }

    /**
     * Calculates monthly revenue
     * @returns Always returns 0 as defense doesn't generate revenue
     */
    public calcMonthlyRevenue(): number {
        return 0;
    }

    /**
     * Calculates maintenance cost
     * @returns Always returns 0 as defense has no maintenance cost
     */
    public calcMaintenanceCost(): number {
        return 0;
    }

    /**
     * Calculates pollution output
     * @returns Always returns 0 as defense doesn't pollute
     */
    public calcMonthlyPollution(): number {
        return 0;
    }
}