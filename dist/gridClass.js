export class Grid {
    constructor(rows, columns) {
        this._rows = this.rowsCheck(rows);
        this._columns = this.columnCheck(columns);
        this._cells = new Array(rows)
            .fill(null)
            .map(() => new Array(columns).fill(null));
    }
    columnCheck(col) {
        if (col < 0 || col > this._columns - 1) {
            return -1;
        }
        return col;
    }
    rowsCheck(row) {
        if (row < 0 || row > this._rows - 1) {
            return -1;
        }
        return row;
    }
    addFacility(facility, rows, col) {
        if (!this.validateCoordinates(rows, col) ||
            this._cells[rows][col] !== null) {
            return false;
        }
        if (facility.typeOf.includes("PlanetaryDefense")) {
            if (this.countFacilities("PlanetaryDefense") > 0) {
                return false;
            }
        }
        this._cells[rows][col] = facility;
        return true;
    }
    removeFacility(rows, col) {
        if (!this.validateCoordinates(rows, col) ||
            this._cells[rows][col] === null) {
            return null;
        }
        const removedFacility = this._cells[rows][col];
        this._cells[rows][col] = null;
        return removedFacility;
    }
    // Utility functions
    validateCoordinates(rows, col) {
        if (rows < 0 || rows >= this._rows || col < 0 || col >= this._columns) {
            return false;
        }
        return true;
    }
    countFacilities(type) {
        let count = 0;
        for (let i = 0; i < this._cells.length; i++) {
            for (let j = 0; j < this._cells[i].length; j++) {
                const cell = this._cells[i][j];
                if (cell === null || cell === void 0 ? void 0 : cell.typeOf.includes(type)) {
                    count++;
                }
            }
        }
        return count;
    }
    // Getters Below
    getFacilityInRadius(rows, col, radius) {
        const facilities = [];
        if (!this.validateCoordinates(rows, col)) {
            return facilities;
        }
        const minX = Math.max(0, rows - radius);
        const maxX = Math.min(this._rows - 1, rows + radius);
        const minY = Math.max(0, col - radius);
        const maxY = Math.min(this._columns - 1, col + radius);
        for (let i = minX; i <= maxX; i++) {
            for (let j = minY; j <= maxY; j++) {
                if (this._cells[i][j] !== null) {
                    facilities.push(this._cells[i][j]);
                }
            }
        }
        return facilities;
    }
    hasFacilityTypeInRadius(x, y, radius, type) {
        return this.getFacilityInRadius(x, y, radius).some((f) => f.typeOf.includes(type));
    }
    getFacility(x, y) {
        if (!this.validateCoordinates(x, y)) {
            return null;
        }
        return this._cells[x][y];
    }
    getAllFacilities() {
        return this._cells;
    }
    get rows() {
        return this._rows;
    }
    get columns() {
        return this._columns;
    }
}
//# sourceMappingURL=gridClass.js.map