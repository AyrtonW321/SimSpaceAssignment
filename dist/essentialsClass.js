import { Facility } from "./facilityClass";
export class EmergencyServices extends Facility {
    constructor(x, y) {
        super(x, y, 100000000, 10, "EmergencyServices");
    }
    calcMonthlyRevenue() {
        return 0;
    }
    calcMaintenanceCost() {
        return 1000000;
    }
    calcMonthlyPollution() {
        return 0;
    }
}
export class EducationCenter extends Facility {
    constructor(x, y) {
        super(x, y, 500000000, 15, "EducationCenter");
    }
    calcMonthlyRevenue() {
        return 0;
    }
    calcMaintenanceCost() {
        return 50000000;
    }
    calcMonthlyPollution() {
        return 0;
    }
}
export class MedicalCenter extends Facility {
    constructor(x, y) {
        super(x, y, 1000000000, 20, "MedicalCenter");
    }
    calcMonthlyRevenue() {
        return 0;
    }
    calcMaintenanceCost() {
        return 150000000;
    }
    calcMonthlyPollution() {
        return 0;
    }
}
export class GovernmentFacility extends Facility {
    constructor(x, y) {
        super(x, y, 100000000, 10, "GovernmentFacility");
    }
    calcMonthlyRevenue() {
        return 0;
    }
    calcMaintenanceCost() {
        return 1000000;
    }
    calcMonthlyPollution() {
        return 0;
    }
}
export class PowerPlant extends Facility {
    constructor(x, y) {
        super(x, y, 500000000, 0, "PowerPlant");
        this._powerOutput = 100;
    }
    calcMonthlyRevenue() {
        return 0;
    }
    calcMaintenanceCost() {
        return 2000000;
    }
    calcMonthlyPollution() {
        return 0;
    }
    get powerOutput() {
        return this._powerOutput;
    }
}
//# sourceMappingURL=essentialsClass.js.map