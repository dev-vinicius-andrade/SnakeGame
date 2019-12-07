import Direction from "../entities/direction.js"
export default class DirectionModule {
    constructor() {

    }
    ArrowRight()
    {
        return new Direction(1,0,0);
    }
    ArrowLeft(){
        return new Direction(-1,0,0);
    }
    ArrowUp(){
        return new Direction(0,-1,0);
    }
    ArrowDown(){
        return new Direction(0,1,0);
    }
}