import { Intersection } from "../shared/intersection.model";
import { Stone } from "../shared/stone.model";

export class GameService {
    intersections:Intersection[] = [];
    stones:Stone[] = [];
    groups:Stone[][] = [];
    
    constructor() {
        this.getIntersections();
    }
    getStoneByIntersection = (i:Intersection) => { 
        return this.stones.filter(
            s => s.clacked === i.isClicked &&
            s.color === i.color &&
            s.move === i.move &&
            s.y === i.y &&
            s.x === i.x
            )[0];
    }
    getStonesByColor = (color:boolean):Stone[] => {
        return this.stones
        .filter(s => s.color === color);
    }
    getStoneByCoordinates = (
        x:number,
        y:number
        ):Stone => {
        return this.stones
        .filter(s => s.x === x && s.y === y)[0];
    }
    getGroupIndexByStone = (stone:Stone):number => {
        for(let i = 0; i < this.groups.length; i++){
            if(this.groups[i].some(s => s.x === stone.x && s.y === stone.y)){
                return i;
            }
        }
        return -1;
    }
    getGroupRelationshipIndexesArray = (related:Stone[]):number[] => {
        return related
        .map(s => this.getGroupIndexByStone(s))
        .filter(n => n !== -1);
    }
    getGroups = (stone:Stone):void => {
        if(stone.liberty === 4){
            this.groups.push([
                stone
            ]);
            
            return;
        }
        
        const related = this.getStoneRelationships(stone);
        if(related.length === 0){
            this.groups.push([
                stone
            ]);
            return;
        }
        for(let i = 0; i < related.length; i++){
            let currentRelatedStone = related[i];
            currentRelatedStone.liberty = this.getLiberties(currentRelatedStone);
        }
        const colorRelationship = related
        .filter(s => s.color === stone.color);
        const colorRelatedIndexArray = this.getGroupRelationshipIndexesArray(colorRelationship);
        if(!colorRelatedIndexArray){
            this.groups.push([stone]);
        }
        if(colorRelatedIndexArray.length === 1){
            this.groups[
                colorRelatedIndexArray[0]
            ].push(stone);
            return;
        }else{
            let newGroupArray:Stone[] = [stone];
            for(let i = 0; i < colorRelatedIndexArray.length;i++){
                let currentIndex = colorRelatedIndexArray[i];
                newGroupArray = newGroupArray.concat(this.groups[currentIndex]);
            }
            this.groups = this.groups
            .filter(
                (g,i) => 
                !colorRelatedIndexArray
                .some(index => index === i)
                );
            this.groups.push(newGroupArray);
        }
    }
    viewStones = (stone:Stone) => {
        // console.log('current stone relationships' + '\n')
        // let related = this.getStoneRelationships(stone);
        // const colorRelationship = related
        // .filter(s => s.color === stone.color);
        // console.log(colorRelationship);
        // const stuff = this.getGroupRelationshipIndexesArray(colorRelationship);
        // console.log(stuff)
        console.log('current stone relationships')
        console.log(this.getStoneRelationships(stone));
        console.log('current Stone Group Indexes');
        console.log(this.getStoneRelationships(stone).map(s => this.getGroupIndexByStone(s)))
    }
    addStone = (stone:Stone):void => {
        this.viewStones(stone);
        this.getGroups(stone);
        this.stones.push(stone);
        console.log(this.groups)
    }
    giveStone =(intersection:Intersection)=> {
        const clacked = intersection.isClicked;
        const move = intersection.move;
        const color = intersection.color;
        const x = intersection.x;
        const y = intersection.y;
        const stone = new Stone(
            clacked,
            move,
            color,
            x,
            y,
        )
        stone.liberty = this.getLiberties(stone);
        return stone;
    }
    getLibertiesArray = (stone:Stone):number[] => {
        return [
            stone.xPlus,
            stone.xMinus,
            stone.yPlus,
            stone.yMinus
        ];
    }
    getStoneRelationships = (stone:Stone):Stone[] => {
        const airs:number[] = this.getLibertiesArray(stone);
        let related:Stone[] = [];
        for(let i = 0; i < airs.length; i++){
            if(i < 2 && this.getStoneByCoordinates(airs[i], stone.y)){
                related.push(this.getStoneByCoordinates(airs[i],stone.y));
                  continue;
            }
            if(i > 1 && this.getStoneByCoordinates(stone.x, airs[i])){
                related.push(this.getStoneByCoordinates(stone.x, airs[i]));
            }
        }
        return related;
    }
    getLiberties = (stone:Stone):number => {
        const airs:number[] = this.getLibertiesArray(stone);
        let liberties = 4;
        if(stone.x === 1 || stone.x === 9){
            liberties--;
        }
        if(stone.y === 1 || stone.y === 9){
            liberties--;
        }
        if(this.stones.length === 0) {
            return liberties;
        }
        for(let i = 0; i < airs.length;i++){
            if(i < 2){
                liberties = this.getIsClicked(airs[i], stone.y) ?
                 liberties - 1 :
                  liberties;
                  continue;
            }
            liberties = this.getIsClicked(stone.x, airs[i]) ?
            liberties - 1 : 
            liberties;
        }
        return liberties;
    }
    getIsClicked = (
        x:number,
         y:number
         ):boolean => {
        if(this.stones.length === 0){
            return false;
        }
        return this.intersections
        .some(i => i.x === x && i.y === y && i.isClicked)
    }
    
    getIntersections = ():void => {
        for(let x = 1; x < 10; x++) {
          for(let y = 1; y < 10; y++){
            this.intersections.push(
              new Intersection(
                false,
                0,
                false,
                x,
                y
              )
            )
          }
        }
      }
}