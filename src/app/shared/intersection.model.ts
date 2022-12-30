export class Intersection {
    public isClicked:boolean
    public move:number
    public color:boolean
    public x:number
    public y:number
    constructor(
        isClicked:boolean,
        move:number,
        color:boolean,
        x:number,
        y:number
        ){
        this.isClicked = isClicked;
        this.move = move;
        this.color = color;
        this.x = x;
        this.y = y;
    }
}