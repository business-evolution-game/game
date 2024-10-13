import {Vector2} from "three";
import {createPosition} from "@core/tools";
import Cell from "./Cell";

export default class CellManager {

    public readonly cellMap: Map<number, Cell> = new Map<number, Cell>();
    private readonly cells: Cell[] = [];

    constructor() {
        this.fillCellMap();
        this.cells = Array.from(this.cellMap).map((cm)=>cm[1]);
    }

    public getCellCountForStep(step:number):number {
        return this.cells.reduce((acc, cell)=>{
            const cellStep = cell.position&0x3F;
            if(!acc[cellStep]){
                acc[cellStep] = 0;
            }
            acc[cellStep]++;
            return acc;
        }, {} as {[key:number]: number})[step];
    }

    public getCellArray():Cell[] {
        return this.cells
    }

    private fillCellMap() {
        this.addPositionToCellMap(createPosition(0), new Vector2(-330, -220));
        this.addPositionToCellMap(createPosition(1), new Vector2(-140 - 55 * 2, -153));
        this.addCategoryToCellMap(2, -193 + 55 * 0, -191, 67);
        this.addCategoryToCellMap(3, -193 + 55 * 1, -191, 67);
        this.addCategoryToCellMap(4, -193 + 55 * 2, -191, 67);
        this.addPositionToCellMap(createPosition(5), new Vector2(-28, -95));
        this.addPositionToCellMap(createPosition(6), new Vector2(27, -95));

        this.addCategoryToCellMap(7, 192 - 55 * 2, -191, 67);
        this.addCategoryToCellMap(8, 192 - 55 * 1, -191, 67);
        this.addCategoryToCellMap(9, 192 - 55 * 0, -191, 67);
        this.addPositionToCellMap(createPosition(10), new Vector2(139 + 55 * 2, -153));

        this.addPositionToCellMap(createPosition(11, 1), new Vector2(330, -220));
        this.addPositionToCellMap(createPosition(11, 2), new Vector2(293, -99));
        this.addPositionToCellMap(createPosition(12), new Vector2(293, -29));
        this.addPositionToCellMap(createPosition(13), new Vector2(238, -29));

        this.addPositionToCellMap(createPosition(14), new Vector2(238, 27));
        this.addPositionToCellMap(createPosition(15), new Vector2(293, 27));
        this.addPositionToCellMap(createPosition(16), new Vector2(293, 97));

        this.addPositionToCellMap(createPosition(17), new Vector2(330, 220));
        this.addPositionToCellMap(createPosition(18), new Vector2(139 + 55 * 2, 149));
        this.addCategoryToCellMap(19, 192 - 55 * 0, 54, 67);
        this.addCategoryToCellMap(20, 192 - 55 * 1, 54, 67);
        this.addCategoryToCellMap(21, 192 - 55 * 2, 54, 67);

        this.addPositionToCellMap(createPosition(22), new Vector2(27, 92));
        this.addPositionToCellMap(createPosition(23), new Vector2(-27, 91));

        this.addCategoryToCellMap(24, -193 + 55 * 0, 54, 67);
        this.addCategoryToCellMap(25, -193 + 55 * 1, 54, 67);
        this.addCategoryToCellMap(26, -193 + 55 * 2, 54, 67);

        this.addPositionToCellMap(createPosition(27), new Vector2(-140 - 55 * 2, 148));


        this.addPositionToCellMap(createPosition(28), new Vector2(-330, 220));
        this.addPositionToCellMap(createPosition(29), new Vector2(-294, 97));
        this.addPositionToCellMap(createPosition(30), new Vector2(-294, 27.5));
        this.addPositionToCellMap(createPosition(31), new Vector2(-239, 27));


        this.addPositionToCellMap(createPosition(32), new Vector2(-239.5, -29))
        this.addPositionToCellMap(createPosition(33), new Vector2(-294.5, -29));
        this.addPositionToCellMap(createPosition(34), new Vector2(-294.5, -99))
    }

    private addCategoryToCellMap(step: number, x: number, y: number, yDiff: number) {
        this.addPositionToCellMap(createPosition(step, 1), new Vector2(x, y - 0.5));
        this.addPositionToCellMap(createPosition(step, 2), new Vector2(x, y - 0.5 + yDiff));
        this.addPositionToCellMap(createPosition(step, 3), new Vector2(x, y - 0.5 + yDiff * 2));
    }

    private addPositionToCellMap(position: number, boardPosition: Vector2) {
        this.cellMap.set(position, new Cell(position, boardPosition));
    }
}
