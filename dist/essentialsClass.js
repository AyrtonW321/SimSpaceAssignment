"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerPlant = exports.GovernmentFacility = exports.MedicalCenter = exports.EducationCenter = exports.EmergencyServices = void 0;
const facilityClass_1 = require("./facilityClass");
class EmergencyServices extends facilityClass_1.Facility {
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
exports.EmergencyServices = EmergencyServices;
class EducationCenter extends facilityClass_1.Facility {
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
exports.EducationCenter = EducationCenter;
class MedicalCenter extends facilityClass_1.Facility {
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
exports.MedicalCenter = MedicalCenter;
class GovernmentFacility extends facilityClass_1.Facility {
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
exports.GovernmentFacility = GovernmentFacility;
class PowerPlant extends facilityClass_1.Facility {
    _powerOutput = 100;
    constructor(x, y) {
        super(x, y, 500000000, 0, "PowerPlant");
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
exports.PowerPlant = PowerPlant;
//# sourceMappingURL=essentialsClass.js.map