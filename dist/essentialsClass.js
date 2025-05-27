// import the facility class
import { Facility } from "./facilityClass.js";
// create the emergency services class that extends from the facility class
export class EmergencyServices extends Facility {
    // define the properties of the emergency services
    constructor(x, y) {
        // call super that calls the constructor of the facility class
        super(x, y, 100000000, 10, "EmergencyServices");
    }
    // public method to calculate the monthly revenue
    calcMonthlyRevenue() {
        return 0;
    }
    // public method to calculate the maintenance cost
    calcMaintenanceCost() {
        return 1000000;
    }
    // public method to calculate the monthly pollution
    calcMonthlyPollution() {
        return 0;
    }
}
// create the education centre class that extends from the facility class
export class EducationCenter extends Facility {
    // construct using the grid position
    constructor(x, y) {
        // call super that calls the constructor of the facility class
        super(x, y, 500000000, 15, "EducationCenter");
    }
    // public method to calculate the monthly revenue
    calcMonthlyRevenue() {
        return 0;
    }
    // public method to calculate the maintenance cost
    calcMaintenanceCost() {
        return 50000000;
    }
    // public method to calculate the monthly pollution
    calcMonthlyPollution() {
        return 0;
    }
}
export class MedicalCenter extends Facility {
    // construct using the grid position
    constructor(x, y) {
        // call super that calls the constructor of the facility class
        super(x, y, 1000000000, 20, "MedicalCenter");
    }
    // public method to calculate the monthly revenue
    calcMonthlyRevenue() {
        return 0;
    }
    // public method to calculate the maintenance cost
    calcMaintenanceCost() {
        return 150000000;
    }
    // public method to calculate the monthly pollution
    calcMonthlyPollution() {
        return 0;
    }
}
export class GovernmentFacility extends Facility {
    // construct using the grid position
    constructor(x, y) {
        // call super that calls the constructor of the facility class
        super(x, y, 100000000, 10, "GovernmentFacility");
    }
    // public method to calculate the monthly revenue
    calcMonthlyRevenue() {
        return 0;
    }
    // public method to calculate the maintenance cost
    calcMaintenanceCost() {
        return 1000000;
    }
    // public method to calculate the monthly pollution
    calcMonthlyPollution() {
        return 0;
    }
}
export class PowerPlant extends Facility {
    // construct using the grid position
    constructor(x, y) {
        // call super that calls the constructor of the facility class
        super(x, y, 500000000, 0, "PowerPlant");
        this._powerOutput = 100;
        // set the power output of the power plant
        this._hasPower = true;
    }
    // public method to calculate the monthly revenue
    calcMonthlyRevenue() {
        return 0;
    }
    // public method to calculate the maintenance cost
    calcMaintenanceCost() {
        return 2000000;
    }
    // public method to calculate the monthly pollution
    calcMonthlyPollution() {
        return 0;
    }
    // public method to get the power output of the power plant
    get powerOutput() {
        return this._powerOutput;
    }
}
//# sourceMappingURL=essentialsClass.js.map