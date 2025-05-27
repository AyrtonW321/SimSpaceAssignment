// import the facility class
import { Facility } from "./facilityClass.js";
/**
 * An abstract base class for all residential facilities.
 * Extends the base Facility class and provides common properties and methods for residences.
 */
export class Residence extends Facility {
    /**
     * Constructs a Residence facility.
     * @param x The x-coordinate on the grid.
     * @param y The y-coordinate on the grid.
     * @param buildCost The cost to build the residence.
     * @param powerConsumption The power consumed by the residence.
     * @param typeOf The type of residence (e.g., "LuxuryResidence", "ComfortableResidence").
     */
    constructor(x, y, buildCost, powerConsumption, typeOf) {
        super(x, y, buildCost, powerConsumption, typeOf);
        this._happyPopulation = 0;
        this._contentPopulation = 0;
        this._currPopulation = 0;
        this._currMaxPopulation = 0;
        this._monthsSinceBuilt = 0;
    }
    // Getters
    /**
     * Gets the number of happy residents in the facility.
     * @returns The happy population count.
     */
    get happyPopulation() {
        return this._happyPopulation;
    }
    /**
     * Gets the number of content residents in the facility.
     * @returns The content population count.
     */
    get contentPopulation() {
        return this._contentPopulation;
    }
    /**
     * Gets the current population of the facility.
     * @returns The current population.
     */
    get currPopulation() {
        return this._currPopulation;
    }
    /**
     * Gets the current maximum population capacity of the facility.
     * @returns The current maximum population.
     */
    get currMaxPopulation() {
        return this._currMaxPopulation;
    }
    /**
     * Gets the number of months since the facility was built.
     * @returns The months since built.
     */
    get monthsSinceBuilt() {
        return this._monthsSinceBuilt;
    }
    /**
     * Checks if the residence has all required essential services within range.
     * Required services include EducationCenter, MedicalCenter, EmergencyServices, GovernmentFacility, and PowerPlant.
     * @param grid The game grid to check for facilities.
     * @returns True if all essential services are present, false otherwise.
     */
    hasRequiredServices(grid) {
        const essentialServices = [
            "EducationCenter",
            "MedicalCenter",
            "EmergencyServices",
            "GovernmentFacility",
            "PowerPlant",
        ];
        return essentialServices.every((service) => grid.hasFacilityTypeInRadius(this.x, this.y, 8, service));
    }
    /**
     * Checks if the residence has required amenities (Store and Restaurant) within range.
     * @param grid The game grid to check for facilities.
     * @returns True if all required amenities are present, false otherwise.
     */
    hasRequiredAmenities(grid) {
        return (grid.hasFacilityTypeInRadius(this.x, this.y, 5, "Store") &&
            grid.hasFacilityTypeInRadius(this.x, this.y, 3, "Restaurant"));
    }
    /**
     * Determines if the residence can be built at its current location based on service and amenity requirements.
     * @param grid The game grid to check requirements against.
     * @returns True if the residence can be built, false otherwise.
     */
    canBeBuilt(grid) {
        return (this.hasRequiredServices(grid) && this.hasRequiredAmenities(grid));
    }
    /**
     * Increases the current population of the residence towards its maximum capacity.
     * Growth is typically a percentage of the maximum population.
     * @protected
     */
    growPopulation() {
        if (this._currPopulation < this._currMaxPopulation) {
            const growthAmount = Math.floor(this._currMaxPopulation * 0.1);
            this._currPopulation = Math.min(this._currPopulation + growthAmount, this._currMaxPopulation);
        }
    }
    /**
     * Updates the breakdown of happy and content population based on a given happy ratio.
     * @param happyRatio The ratio (0-1) of the current population that is happy.
     * @protected
     */
    updatePopulationCategories(happyRatio) {
        this._happyPopulation = Math.floor(this._currPopulation * happyRatio);
        this._contentPopulation = this._currPopulation - this._happyPopulation;
    }
}
/**
 * Represents a Luxury Residence facility.
 * Provides high revenue but has strict requirements for population growth.
 */
export class LuxuryResidence extends Residence {
    /**
     * Constructs a Luxury Residence.
     * @param x The x-coordinate on the grid.
     * @param y The y-coordinate on the grid.
     */
    constructor(x, y) {
        super(x, y, 1000000000, 100, "LuxuryResidence");
        this._absoluteMaxPopulation = 10000;
        this._hasStore = false;
        this._hasRestaurant = false;
        this._currMaxPopulation = 0;
    }
    /**
     * Calculates the monthly revenue for the Luxury Residence.
     * Revenue scales with the number of residents in thousands.
     * @returns The calculated monthly revenue.
     */
    calcMonthlyRevenue() {
        if (!this.hasPower)
            return 0;
        const thousandsOfResidents = Math.floor(this.currPopulation / 1000);
        return thousandsOfResidents * 15000000;
    }
    /**
     * Calculates the monthly maintenance cost for the Luxury Residence.
     * Cost includes a base amount and an additional cost per thousand residents.
     * @returns The calculated monthly maintenance cost.
     */
    calcMaintenanceCost() {
        const baseCost = 10000000;
        const perThousandCost = Math.floor(this.currPopulation / 1000) * 1000000;
        return baseCost + perThousandCost;
    }
    /**
     * Calculates the monthly pollution generated by the Luxury Residence.
     * Pollution scales with the number of residents in thousands.
     * @returns The calculated monthly pollution.
     */
    calcMonthlyPollution() {
        return Math.floor(this.currPopulation / 1000) * 500;
    }
    /**
     * Updates the population of the Luxury Residence based on amenity availability and essential services.
     * Population growth is affected by the presence of a Store and Restaurant.
     * @param grid The game grid to check for amenities and services.
     */
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
    /**
     * Checks if both luxury amenities (Store and Restaurant) are present.
     * @returns True if both are present, false otherwise.
     */
    get luxuryAmenitiesStatus() {
        return this._hasStore && this._hasRestaurant;
    }
    /**
     * Provides a descriptive string of the status of luxury amenities.
     * @returns A string indicating whether a Store and Restaurant are present.
     */
    get luxuryAmenitiesStatusDescription() {
        return `Store: ${this._hasStore ? "✅" : "❌"}, Restaurant: ${this._hasRestaurant ? "✅" : "❌"}`;
    }
}
/**
 * Represents a Comfortable Residence facility.
 * Offers moderate revenue and population capacity.
 */
export class ComfortableResidence extends Residence {
    /**
     * Constructs a Comfortable Residence.
     * @param x The x-coordinate on the grid.
     * @param y The y-coordinate on the grid.
     */
    constructor(x, y) {
        super(x, y, 500000000, 50, "ComfortableResidence");
        this._absoluteMaxPopulation = 15000;
        this._hasStore = false;
        this._hasRestaurant = false;
        this._currMaxPopulation = 0;
    }
    /**
     * Calculates the monthly revenue for the Comfortable Residence.
     * Revenue scales with the number of residents in thousands.
     * @returns The calculated monthly revenue.
     */
    calcMonthlyRevenue() {
        if (!this.hasPower)
            return 0;
        const thousandsOfResidents = Math.floor(this.currPopulation / 1000);
        return thousandsOfResidents * 1000000;
    }
    /**
     * Calculates the monthly maintenance cost for the Comfortable Residence.
     * Cost includes a base amount and an additional cost per thousand residents.
     * @returns The calculated monthly maintenance cost.
     */
    calcMaintenanceCost() {
        const baseCost = 40000;
        const perThousandCost = Math.floor(this.currPopulation / 1000) * 50000;
        return baseCost + perThousandCost;
    }
    /**
     * Calculates the monthly pollution generated by the Comfortable Residence.
     * Pollution scales with the number of residents in thousands.
     * @returns The calculated monthly pollution.
     */
    calcMonthlyPollution() {
        return Math.floor(this.currPopulation / 1000) * 50;
    }
    /**
     * Updates the population of the Comfortable Residence based on amenity availability and essential services.
     * @param grid The game grid to check for amenities and services.
     */
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
    /**
     * Checks if both comfortable amenities (Store and Restaurant) are present.
     * @returns True if both are present, false otherwise.
     */
    get comfortableAmenitiesStatus() {
        return this._hasStore && this._hasRestaurant;
    }
    /**
     * Provides a descriptive string of the status of comfortable amenities.
     * @returns A string indicating whether a Store and Restaurant are present.
     */
    get comfortableAmenitiesStatusDescription() {
        return `Store: ${this._hasStore ? "✅" : "❌"}, Restaurant: ${this._hasRestaurant ? "✅" : "❌"}`;
    }
}
/**
 * Represents an Affordable Residence facility.
 * Provides basic housing with higher population capacity but lower revenue.
 */
export class AffordableResidence extends Residence {
    /**
     * Constructs an Affordable Residence.
     * @param x The x-coordinate on the grid.
     * @param y The y-coordinate on the grid.
     */
    constructor(x, y) {
        super(x, y, 50000000, 25, "AffordableResidence");
        this._absoluteMaxPopulation = 25000;
        this._hasStore = false;
        this._hasRestaurant = false;
        this._currMaxPopulation = 0;
    }
    /**
     * Calculates the monthly revenue for the Affordable Residence.
     * Revenue scales with the number of residents in thousands.
     * @returns The calculated monthly revenue.
     */
    calcMonthlyRevenue() {
        if (!this.hasPower)
            return 0;
        const thousandsOfResidents = Math.floor(this.currPopulation / 1000);
        return thousandsOfResidents * 10000;
    }
    /**
     * Calculates the monthly maintenance cost for the Affordable Residence.
     * Cost includes a base amount and an additional cost per thousand residents.
     * @returns The calculated monthly maintenance cost.
     */
    calcMaintenanceCost() {
        const baseCost = 8000;
        const perThousandCost = Math.floor(this.currPopulation / 1000) * 2000;
        return baseCost + perThousandCost;
    }
    /**
     * Calculates the monthly pollution generated by the Affordable Residence.
     * Pollution scales with the number of residents in thousands.
     * @returns The calculated monthly pollution.
     */
    calcMonthlyPollution() {
        return Math.floor(this.currPopulation / 1000) * 10;
    }
    /**
     * Updates the population of the Affordable Residence based on amenity availability and essential services.
     * @param grid The game grid to check for amenities and services.
     */
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
    /**
     * Checks if both affordable amenities (Store and Restaurant) are present.
     * @returns True if both are present, false otherwise.
     */
    get affordableAmenitiesStatus() {
        return this._hasStore && this._hasRestaurant;
    }
    /**
     * Provides a descriptive string of the status of affordable amenities.
     * @returns A string indicating whether a Store and Restaurant are present.
     */
    get affordableAmenitiesStatusDescription() {
        return `Store: ${this._hasStore ? "✅" : "❌"}, Restaurant: ${this._hasRestaurant ? "✅" : "❌"}`;
    }
}
//# sourceMappingURL=residenceClass.js.map