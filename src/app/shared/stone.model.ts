export class Stone {
    public clacked:boolean;
    public move:number;
    public color:boolean;
    public x:number;
    public y:number;
    public xPlus:number;
    public xMinus:number;
    public yPlus:number;
    public yMinus:number;
    public liberty:number;
    constructor(
        click:boolean,
        move:number,
        color:boolean,
        x:number,
        y:number
        ) {
        this.clacked = click;
        this.move = move;
        this.color = color;
        this.x = x;
        this.y = y;
        this.xPlus = this.x + 1;
        this.xMinus = this.x - 1;
        this.yPlus = this.y + 1;
        this.yMinus = this.y - 1;
        this.liberty = 4;
    }
}