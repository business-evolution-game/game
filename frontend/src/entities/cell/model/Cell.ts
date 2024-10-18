import {Vector2} from "three";

export default class Cell {

    constructor(
        public readonly position:number,
        public readonly boardPosition:Vector2,
        public readonly name:string="",
        public readonly imageUrl:string=""
    ) {}

}


