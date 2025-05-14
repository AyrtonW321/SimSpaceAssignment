"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffordableResidence = exports.ComfortableResidence = exports.LuxuryResidence = exports.Residence = void 0;
const facilityClass_1 = require("./facilityClass");
class Residence extends facilityClass_1.Facility {
    _happyPopulation = 0;
    _contentPopulation = 0;
    _currPopulation = 0;
    _currMaxPopulation = 0;
    _monthsSinceBuilt = 0;
    // Getters
    get happyPopulation() {
        return this._happyPopulation;
    }
    get contentPopulation() {
        return this._contentPopulation;
    }
    get currPopulation() {
        return this._currPopulation;
    }
    get currMaxPopulation() {
        return this._currMaxPopulation;
    }
    get monthsSinceBuilt() {
        return this._monthsSinceBuilt;
    }
    hasRequiredServices(grid) {
        const essentialServices = [
            "EducationCenter",
            "MedicalCenter",
            "EmergencyServices",
            "GovernmentFacility",
            "EnvironmentalFacility",
        ];
        return essentialServices.every((service) => grid.hasFacilityTypeInRadius(this.x, this.y, 8, service));
    }
    hasRequiredAmenities(grid) {
        return (grid.hasFacilityTypeInRadius(this.x, this.y, 5, "Store") &&
            grid.hasFacilityTypeInRadius(this.x, this.y, 3, "Restaurant"));
    }
    canBeBuilt(grid) {
        return (this.hasRequiredServices(grid) && this.hasRequiredAmenities(grid));
    }
    constructor(x, y, buildCost, powerConsumption, typeOf) {
        super(x, y, buildCost, powerConsumption, typeOf);
    }
    growPopulation() {
        if (this._currPopulation < this._currMaxPopulation) {
            const growthAmount = Math.floor(this._currMaxPopulation * 0.1);
            this._currPopulation = Math.min(this._currPopulation + growthAmount, this._currMaxPopulation);
        }
    }
    updatePopulationCategories(happyRatio) {
        this._happyPopulation = Math.floor(this._currPopulation * happyRatio);
        this._contentPopulation = this._currPopulation - this._happyPopulation;
    }
}
exports.Residence = Residence;
class LuxuryResidence extends Residence {
    _absoluteMaxPopulation = 10000;
    _hasStore = false;
    _hasRestaurant = false;
    constructor(x, y) {
        super(x, y, 1000000000, 100, "LuxuryResidence");
        this._currMaxPopulation = 0;
    }
    calcMonthlyRevenue() {
        if (!this.hasPower)
            return 0;
        const thousandsOfResidents = Math.floor(this.currPopulation / 1000);
        return thousandsOfResidents * 15000000;
    }
    calcMaintenanceCost() {
        const baseCost = 10000000;
        const perThousandCost = Math.floor(this.currPopulation / 1000) * 1000000;
        return baseCost + perThousandCost;
    }
    calcMonthlyPollution() {
        return Math.floor(this.currPopulation / 1000) * 500;
    }
    updatePopulation(grid) {
        this._hasStore = grid.hasFacilityTypeInRadius(this.x, this.y, 5, "Store");
        this._hasRestaurant = grid.hasFacilityTypeInRadius(this.x, this.y, 3, "Restaurant");
        if (this._hasStore && this._hasRestaurant) {
            this._currMaxPopulation = this._absoluteMaxPopulation;
        }
        else {
            this._currMaxPopulation = 5000;
        }
        if (super.hasRequiredServices(grid) &&
            this._currPopulation < this._currMaxPopulation) {
            const monthlyGrowth = Math.floor(this._currMaxPopulation * 0.1);
            this._currPopulation = Math.min(this._currPopulation + monthlyGrowth, this._currMaxPopulation);
            this._happyPopulation = Math.floor(this._currPopulation * 0.5);
            this._contentPopulation =
                this._currPopulation - this._happyPopulation;
        }
        this.incrementMonths;
    }
    get luxuryAmenitiesStatus() {
        return this._hasStore && this._hasRestaurant;
    }
    get luxuryAmenitiesStatusDescription() {
        return `Store: ${this._hasStore ? "✅" : "❌"}, Restaurant: ${this._hasRestaurant ? "✅" : "❌"}`;
    }
}
exports.LuxuryResidence = LuxuryResidence;
class ComfortableResidence extends Residence {
    _absoluteMaxPopulation = 15000;
    _hasStore = false;
    _hasRestaurant = false;
    constructor(x, y) {
        super(x, y, 500000000, 50, "ComfortableResidence");
        this._currMaxPopulation = 0;
    }
    calcMonthlyRevenue() {
        if (!this.hasPower)
            return 0;
        const thousandsOfResidents = Math.floor(this.currPopulation / 1000);
        return thousandsOfResidents * 1000000;
    }
    calcMaintenanceCost() {
        const baseCost = 40000;
        const perThousandCost = Math.floor(this.currPopulation / 1000) * 50000;
        return baseCost + perThousandCost;
    }
    calcMonthlyPollution() {
        return Math.floor(this.currPopulation / 1000) * 50;
    }
    updatePopulation(grid) {
        this._hasStore = grid.hasFacilityTypeInRadius(this.x, this.y, 5, "Store");
        this._hasRestaurant = grid.hasFacilityTypeInRadius(this.x, this.y, 3, "Restaurant");
        this._currMaxPopulation = this._absoluteMaxPopulation;
        if (super.hasRequiredServices(grid) &&
            this._currPopulation < this._currMaxPopulation) {
            const monthlyGrowth = Math.floor(this._currMaxPopulation * 0.1);
            this._currPopulation = Math.min(this._currPopulation + monthlyGrowth, this._currMaxPopulation);
            this._happyPopulation = Math.floor(this._currPopulation * 0.25);
            this._contentPopulation =
                this._currPopulation - this._happyPopulation;
        }
        this.incrementMonths();
    }
    get comfortableAmenitiesStatus() {
        return this._hasStore && this._hasRestaurant;
    }
    get comfortableAmenitiesStatusDescription() {
        return `Store: ${this._hasStore ? "✅" : "❌"}, Restaurant: ${this._hasRestaurant ? "✅" : "❌"}`;
    }
}
exports.ComfortableResidence = ComfortableResidence;
class AffordableResidence extends Residence {
    _absoluteMaxPopulation = 25000;
    _hasStore = false;
    _hasRestaurant = false;
    constructor(x, y) {
        super(x, y, 50000000, 25, "AffordableResidence");
        this._currMaxPopulation = 0;
    }
    calcMonthlyRevenue() {
        if (!this.hasPower)
            return 0;
        const thousandsOfResidents = Math.floor(this.currPopulation / 1000);
        return thousandsOfResidents * 10000;
    }
    calcMaintenanceCost() {
        const baseCost = 8000;
        const perThousandCost = Math.floor(this.currPopulation / 1000) * 2000;
        return baseCost + perThousandCost;
    }
    calcMonthlyPollution() {
        return Math.floor(this.currPopulation / 1000) * 10;
    }
    updatePopulation(grid) {
        this._hasStore = grid.hasFacilityTypeInRadius(this.x, this.y, 5, "Store");
        this._hasRestaurant = grid.hasFacilityTypeInRadius(this.x, this.y, 3, "Restaurant");
        this._currMaxPopulation = this._absoluteMaxPopulation;
        if (super.hasRequiredServices(grid) &&
            this._currPopulation < this._currMaxPopulation) {
            const monthlyGrowth = Math.floor(this._currMaxPopulation * 0.1);
            this._currPopulation = Math.min(this._currPopulation + monthlyGrowth, this._currMaxPopulation);
            this._happyPopulation = Math.floor(this._currPopulation * 0.1);
            this._contentPopulation =
                this._currPopulation - this._happyPopulation;
        }
        this.incrementMonths();
    }
    get affordableAmenitiesStatus() {
        return this._hasStore && this._hasRestaurant;
    }
    get affordableAmenitiesStatusDescription() {
        return `Store: ${this._hasStore ? "✅" : "❌"}, Restaurant: ${this._hasRestaurant ? "✅" : "❌"}`;
    }
}
exports.AffordableResidence = AffordableResidence;
//# sourceMappingURL=residenceClass.js.map