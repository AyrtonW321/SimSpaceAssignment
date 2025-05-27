/**
 * Grid class that manages the game grid and facility placement
 * Note: This class doesn't handle drawing the grid, only the logical framework
 */
export class Grid {
    /**
     * Constructs a new Grid
     * @param rows number of rows in grid
     * @param columns number of columns in grid
     */
    constructor(rows, columns) {
        this._rows = this.rowsCheck(rows);
        this._columns = this.columnCheck(columns);
        this._cells = new Array(rows)
            .fill(null)
            .map(() => new Array(columns).fill(null));
    }
    /**
     * Validates column index
     * @param col column index to check
     * @returns validated column index or -1 if invalid
     */
    columnCheck(col) {
        if (col < 0 || col > this._columns - 1) {
            return -1;
        }
        return col;
    }
    /**
     * Validates row index
     * @param row row index to check
     * @returns validated row index or -1 if invalid
     */
    rowsCheck(row) {
        if (row < 0 || row > this._rows - 1) {
            return -1;
        }
        return row;
    }
    /**
     * Adds a facility to the grid
     * @param facility facility to add
     * @param rows row coordinate
     * @param col column coordinate
     * @returns true if facility was added successfully
     */
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
    /**
     * Removes a facility from the grid
     * @param rows row coordinate
     * @param col column coordinate
     * @returns the removed facility or null if none existed
     */
    removeFacility(rows, col) {
        if (!this.validateCoordinates(rows, col) ||
            this._cells[rows][col] === null) {
            return null;
        }
        const removedFacility = this._cells[rows][col];
        this._cells[rows][col] = null;
        return removedFacility;
    }
    /**
     * Validates grid coordinates
     * @param rows row coordinate
     * @param col column coordinate
     * @returns true if coordinates are valid
     */
    validateCoordinates(rows, col) {
        if (rows < 0 || rows >= this._rows || col < 0 || col >= this._columns) {
            return false;
        }
        return true;
    }
    /**
     * Counts facilities of a specific type
     * @param type type string to count
     * @returns number of matching facilities
     */
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
    /**
     * Gets facilities within a certain radius
     * @param rows center row coordinate
     * @param col center column coordinate
     * @param radius search radius
     * @returns array of facilities within radius
     */
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
                const dx = i - rows;
                const dy = j - col;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= radius && this._cells[i][j] !== null) {
                    facilities.push(this._cells[i][j]);
                }
            }
        }
        return facilities;
    }
    /**
     * Checks if a facility type exists within radius
     * @param x center x coordinate
     * @param y center y coordinate
     * @param radius search radius
     * @param type facility type to check for
     * @returns true if at least one matching facility found
     */
    hasFacilityTypeInRadius(x, y, radius, type) {
        return this.getFacilityInRadius(x, y, radius).some((f) => f.typeOf.includes(type));
    }
    /**
     * Gets facility at specific coordinates
     * @param x x coordinate
     * @param y y coordinate
     * @returns facility or null if empty
     */
    getFacility(x, y) {
        if (!this.validateCoordinates(x, y)) {
            return null;
        }
        return this._cells[x][y];
    }
    /**
     * Gets all facilities on grid
     * @returns 2D array of all facilities
     */
    getAllFacilities() {
        return this._cells;
    }
    // Getters for grid dimensions
    get rows() {
        return this._rows;
    }
    get columns() {
        return this._columns;
    }
}
//# sourceMappingURL=gridClass.js.map