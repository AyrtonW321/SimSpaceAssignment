import { Facility } from "./facilityClass.js";

// Grid doesn't actually draw the grid
// It only makes the framework for it

export class Grid {
    private _cells: Facility[][] | null[][];
    private _columns: number;
    private _rows: number;

    constructor(rows: number, columns: number) {
        this._rows = this.rowsCheck(rows);
        this._columns = this.columnCheck(columns);
        this._cells = new Array(rows)
            .fill(null)
            .map(() => new Array(columns).fill(null));
    }

    private columnCheck(col: number): number {
        if (col < 0 || col > this._columns - 1) {
            return -1;
        }
        return col;
    }

    private rowsCheck(row: number): number {
        if (row < 0 || row > this._rows - 1) {
            return -1;
        }
        return row;
    }

    public addFacility(facility: Facility, rows: number, col: number): boolean {
        if (
            !this.validateCoordinates(rows, col) ||
            this._cells[rows][col] !== null
        ) {
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

    public removeFacility(rows: number, col: number): Facility | null {
        if (
            !this.validateCoordinates(rows, col) ||
            this._cells[rows][col] === null
        ) {
            return null;
        }

        const removedFacility = this._cells[rows][col];
        this._cells[rows][col] = null;
        return removedFacility;
    }

    // Utility functions

    private validateCoordinates(rows: number, col: number): boolean {
        if (rows < 0 || rows >= this._rows || col < 0 || col >= this._columns) {
            return false;
        }
        return true;
    }

    public countFacilities(type: string): number {
        let count = 0;
        for (let i = 0; i < this._cells.length; i++) {
            for (let j = 0; j < this._cells[i].length; j++) {
                const cell = this._cells[i][j];
                if (cell?.typeOf.includes(type)) {
                    count++;
                }
            }
        }
        return count;
    }

    // Getters Below

    public getFacilityInRadius(
        rows: number,
        col: number,
        radius: number
    ): Facility[] {
        const facilities: Facility[] = [];

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
                    facilities.push(this._cells[i][j]!);
                }
            }
        }

        return facilities;
    }

    public hasFacilityTypeInRadius(
        x: number,
        y: number,
        radius: number,
        type: string
    ): boolean {
        return this.getFacilityInRadius(x, y, radius).some((f) =>
            f.typeOf.includes(type)
        );
    }

    public getFacility(x: number, y: number): Facility | null {
        if (!this.validateCoordinates(x, y)) {
            return null;
        }
        return this._cells[x][y];
    }

    public getAllFacilities(): Facility[][] | null[][] {
        return this._cells;
    }

    public get rows(): number {
        return this._rows;
    }
    public get columns(): number {
        return this._columns;
    }
}
