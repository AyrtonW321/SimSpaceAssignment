export class Facility {
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
    get x() { return this._x; }
    get y() { return this._y; }
    get buildCost() { return this._buildCost; }
    get powerConsumption() { return this._powerConsumption; }
    get typeOf() { return this._typeOf; }
    get monthsSinceBuilt() { return this._monthsSinceBuilt; }
    get hasPower() { return this._hasPower; }
    incrementMonths() {
        this._monthsSinceBuilt++;
    }
    updatePowerStatus(hasPower) {
        this._hasPower = hasPower;
    }
}
//# sourceMappingURL=facilityClass.js.map