import { Facility } from "./facilityClass";
export class PlanetaryDefense extends Facility {
    constructor(x, y) {
        super(x, y, 1000000000000, 0, "PlanetaryDefense");
    }
    calcMonthlyRevenue() {
        return 0;
    }
    calcMaintenanceCost() {
        return 0;
    }
    calcMonthlyPollution() {
        return 0;
    }
}
//# sourceMappingURL=planetaryDefense.js.map