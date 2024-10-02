import {Vector2} from "three";
import {createPosition} from "../tools";
import Cell from "./Cell";

type cellMap = Array<{ boardPosition: Vector2 }>;

function addCategoryCells(cellMap: cellMap, step: number, x: number, y: number, yDiff: number) {
    cellMap[createPosition(step, 1)] = {boardPosition: new Vector2(x, y - 0.5)}
    cellMap[createPosition(step, 2)] = {boardPosition: new Vector2(x, y - 0.5 + yDiff)}
    cellMap[createPosition(step, 3)] = {boardPosition: new Vector2(x, y - 0.5 + yDiff * 2)}
}

function createCellMap(): cellMap {
    const res: cellMap = [];
    res[createPosition(0)] = {boardPosition:new Vector2(-330, -220)}
    res[createPosition(1)] = {boardPosition: new Vector2(-140 - 55 * 2, -153)}
    addCategoryCells(res, 2, -193 + 55 * 0, -191, 67);
    addCategoryCells(res, 3, -193 + 55 * 1, -191, 67);
    addCategoryCells(res, 4, -193 + 55 * 2, -191, 67);
    res[createPosition(5)] = {boardPosition: new Vector2(-28, -95)}
    res[createPosition(6)] = {boardPosition: new Vector2(27, -95)}

    addCategoryCells(res, 7, 192 - 55 * 2, -191, 67);
    addCategoryCells(res, 8, 192 - 55 * 1, -191, 67);
    addCategoryCells(res, 9, 192 - 55 * 0, -191, 67);
    res[createPosition(10)] = {boardPosition: new Vector2(139 + 55 * 2, -153)}

    res[createPosition(11, 1)] = {boardPosition: new Vector2(293, -99)}
    res[createPosition(11.2)] = {boardPosition:new Vector2(330, -220)}
    res[createPosition(12)] = {boardPosition: new Vector2(293, -29)}
    res[createPosition(13)] = {boardPosition: new Vector2(238, -29)}

    res[createPosition(14)] = {boardPosition: new Vector2(238, 27)}
    res[createPosition(15)] = {boardPosition: new Vector2(293, 27)}
    res[createPosition(16)] = {boardPosition: new Vector2(293, 97)}

    res[createPosition(17)] = {boardPosition:new Vector2(330, 220)}
    res[createPosition(18)] = {boardPosition: new Vector2(139 + 55 * 2, 149)}
    addCategoryCells(res, 19, 192 - 55 * 0, 54, 67);
    addCategoryCells(res, 20, 192 - 55 * 1, 54, 67);
    addCategoryCells(res, 21, 192 - 55 * 2, 54, 67);

    res[createPosition(22)] = {boardPosition: new Vector2(27, 92)}
    res[createPosition(23)] = {boardPosition: new Vector2(-27, 91)}

    addCategoryCells(res, 24, -193 + 55 * 0, 54, 67);
    addCategoryCells(res, 25, -193 + 55 * 1, 54, 67);
    addCategoryCells(res, 26, -193 + 55 * 2, 54, 67);

    res[createPosition(27)] = {boardPosition: new Vector2(-140 - 55 * 2, 148)}


    res[createPosition(28)] = {boardPosition:new Vector2(-330, 220)}
    res[createPosition(29)] = {boardPosition: new Vector2(-294, 97)}
    res[createPosition(30)] = {boardPosition: new Vector2(-294, 27.5)}
    res[createPosition(31)] = {boardPosition: new Vector2(-239, 27)}


    res[createPosition(32)] = {boardPosition: new Vector2(-239.5, -29)}
    res[createPosition(33)] = {boardPosition: new Vector2(-294.5, -29)}
    res[createPosition(34)] = {boardPosition: new Vector2(-294.5, -99)}

    return res;
}

export function createCells(): Array<Cell> {
    const cellMap = createCellMap();

    let cells: Array<Cell> = [];
    for (const cellPosition in cellMap) {
        cells.push(new Cell(Number(cellPosition), cellMap[cellPosition].boardPosition));
    }
    return cells;
}