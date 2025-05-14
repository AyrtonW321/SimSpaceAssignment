"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Facility = void 0;
class Facility {
    _x = 0;
    _y = 0;
    _buildCost = 0;
    _powerConsumption = 0;
    _typeOf;
    _monthsSinceBuilt = 0;
    _hasPower = false;
    constructor(x, y, buildCost, powerConsumption, typeOf) {
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
exports.Facility = Facility;
//# sourceMappingURL=facilityClass.js.map