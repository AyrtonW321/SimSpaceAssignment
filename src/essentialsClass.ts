import { Facility } from "./facilityClass";

export class EmergencyServices extends Facility {
    constructor(x: number, y: number) {
        super(x, y, 100000000, 10, "EmergencyServices");
    }

    public calcMonthlyRevenue(): number {
        return 0; 
    }

    public calcMaintenanceCost(): number {
        return 1000000;
    }

    public calcMonthlyPollution(): number {
        return 0;
    }
}

export class EducationCenter extends Facility {
    constructor(x: number, y: number) {
        super(x, y, 500000000, 15, "EducationCenter");
    }

    public calcMonthlyRevenue(): number {
        return 0;
    }

    public calcMaintenanceCost(): number {
        return 50000000;
    }

    public calcMonthlyPollution(): number {
        return 0;
    }
}

export class MedicalCenter extends Facility {
    constructor(x: number, y: number) {
        super(x, y, 1000000000, 20, "MedicalCenter");
    }

    public calcMonthlyRevenue(): number {
        return 0;
    }

    public calcMaintenanceCost(): number {
        return 150000000;
    }

    public calcMonthlyPollution(): number {
        return 0;
    }
}

export class GovernmentFacility extends Facility {
    constructor(x: number, y: number) {
        super(x, y, 100000000, 10, "GovernmentFacility");
    }

    public calcMonthlyRevenue(): number {
        return 0;
    }

    public calcMaintenanceCost(): number {
        return 1000000;
    }

    public calcMonthlyPollution(): number {
        return 0;
    }
}

export class PowerPlant extends Facility {
    private readonly _powerOutput: number = 100;

    constructor(x: number, y: number) {
        super(x, y, 500000000, 0, "PowerPlant");
    }

    public calcMonthlyRevenue(): number {
        return 0;
    }

    public calcMaintenanceCost(): number {
        return 2000000;
    }

    public calcMonthlyPollution(): number {
        return 0;
    }

    public get powerOutput(): number {
        return this._powerOutput;
    }
}