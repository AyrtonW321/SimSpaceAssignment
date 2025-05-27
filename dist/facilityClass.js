/**
 * Abstract base class for all facility types
 * Defines common properties and methods for all facilities
 */
export class Facility {
    /**
     * Constructs a new Facility
     * @param x x-coordinate on grid
     * @param y y-coordinate on grid
     * @param buildCost construction cost
     * @param powerConsumption power required to operate
     * @param typeOf type identifier string
     */
    constructor(x, y, buildCost, powerConsumption, typeOf) {
        this._x = 0;
        this._y = 0;
        this._buildCost = 0;
        this._powerConsumption = 0;
        this._monthsSinceBuilt = 0;
        this._hasPower = false;
        this._x = x;
        this._y = y;
        this._buildCost = buildCost;
        this._powerConsumption = powerConsumption;
        this._typeOf = typeOf;
    }
    // Getters for all properties
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get buildCost() {
        return this._buildCost;
    }
    get powerConsumption() {
        return this._powerConsumption;
    }
    get typeOf() {
        return this._typeOf;
    }
    get monthsSinceBuilt() {
        return this._monthsSinceBuilt;
    }
    get hasPower() {
        return this._hasPower;
    }
    /**
     * Increments the months since the facility was built
     */
    incrementMonths() {
        this._monthsSinceBuilt++;
    }
    /**
     * Updates the power status of the facility
     * @param hasPower whether the facility has power
     */
    updatePowerStatus(hasPower) {
        this._hasPower = hasPower;
    }
}
//# sourceMappingURL=facilityClass.js.map