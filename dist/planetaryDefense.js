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
    constructor(x, y) {
        super(x, y, 1000000000000, 0, "PlanetaryDefense");
    }
    /**
     * Calculates monthly revenue
     * @returns Always returns 0 as defense doesn't generate revenue
     */
    calcMonthlyRevenue() {
        return 0;
    }
    /**
     * Calculates maintenance cost
     * @returns Always returns 0 as defense has no maintenance cost
     */
    calcMaintenanceCost() {
        return 0;
    }
    /**
     * Calculates pollution output
     * @returns Always returns 0 as defense doesn't pollute
     */
    calcMonthlyPollution() {
        return 0;
    }
}
//# sourceMappingURL=planetaryDefense.js.map