// import the facility class
import { Facility } from "./facilityClass.js";

// create the emergency services class that extends from the facility class
export class EmergencyServices extends Facility {
    // define the properties of the emergency services
    constructor(x: number, y: number) {
        // call super that calls the constructor of the facility class
        super(x, y, 100000000, 10, "EmergencyServices");
    }

    // public method to calculate the monthly revenue
    public calcMonthlyRevenue(): number {
        return 0;
    }

    // public method to calculate the maintenance cost
    public calcMaintenanceCost(): number {
        return 1000000;
    }

    // public method to calculate the monthly pollution
    public calcMonthlyPollution(): number {
        return 0;
    }
}

// create the education centre class that extends from the facility class
export class EducationCenter extends Facility {
    // construct using the grid position
    constructor(x: number, y: number) {
        // call super that calls the constructor of the facility class
        super(x, y, 500000000, 15, "EducationCenter");
    }

// public method to calculate the monthly revenue
    public calcMonthlyRevenue(): number {
        return 0;
    }

    // public method to calculate the maintenance cost
    public calcMaintenanceCost(): number {
        return 50000000;
    }

    // public method to calculate the monthly pollution
    public calcMonthlyPollution(): number {
        return 0;
    }
}

export class MedicalCenter extends Facility {
    // construct using the grid position
    constructor(x: number, y: number) {
        // call super that calls the constructor of the facility class
        super(x, y, 1000000000, 20, "MedicalCenter");
    }

// public method to calculate the monthly revenue
    public calcMonthlyRevenue(): number {
        return 0;
    }

    // public method to calculate the maintenance cost
    public calcMaintenanceCost(): number {
        return 150000000;
    }

    // public method to calculate the monthly pollution
    public calcMonthlyPollution(): number {
        return 0;
    }
}

export class GovernmentFacility extends Facility {
    // construct using the grid position
    constructor(x: number, y: number) {
        // call super that calls the constructor of the facility class
        super(x, y, 100000000, 10, "GovernmentFacility");
    }

    // public method to calculate the monthly revenue
    public calcMonthlyRevenue(): number {
        return 0;
    }

    // public method to calculate the maintenance cost
    public calcMaintenanceCost(): number {
        return 1000000;
    }

    // public method to calculate the monthly pollution
    public calcMonthlyPollution(): number {
        return 0;
    }
}

export class PowerPlant extends Facility {
    private readonly _powerOutput: number = 100;

    // construct using the grid position
    constructor(x: number, y: number) {
        // call super that calls the constructor of the facility class
        super(x, y, 500000000, 0, "PowerPlant");
        // set the power output of the power plant
        this._hasPower = true;
    }

    // public method to calculate the monthly revenue
    public calcMonthlyRevenue(): number {
        return 0;
    }

    // public method to calculate the maintenance cost
    public calcMaintenanceCost(): number {
        return 2000000;
    }

    // public method to calculate the monthly pollution
    public calcMonthlyPollution(): number {
        return 0;
    }

    // public method to get the power output of the power plant
    public get powerOutput(): number {
        return this._powerOutput;
    }
}
