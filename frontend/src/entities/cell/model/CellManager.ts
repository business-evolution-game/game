import {Vector2} from "three";
import Cell from "./Cell";
import fieldMap from './fieldMap.json';

export default class CellManager {

    public readonly cellMap: Map<number, Cell> = new Map<number, Cell>();
    private readonly cells: Cell[] = [];

    constructor() {
        this.fillCellMap();
        this.cells = Array.from(this.cellMap).map((cm) => cm[1]);
    }

    public getCellCountForStep(step: number): number {
        return this.cells.reduce((acc, cell) => {
            const cellStep = cell.position & 0x3F;
            if (!acc[cellStep]) {
                acc[cellStep] = 0;
            }
            acc[cellStep]++;
            return acc;
        }, {} as { [key: number]: number })[step];
    }

    public getCellArray(): Cell[] {
        return this.cells
    }

    private fillCellMap() {
        for (let field of fieldMap) {
            this.cellMap.set(field.position, new Cell(field.position,
                new Vector2(field.boardPosition.x, field.boardPosition.y), field.name, field.imageUrl));
        }
    }

}
