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
    getIntersectionByStone = (stone:Stone):Intersection => {
        return this.intersections
        .filter(i => i.move === stone.move)[0];
    }
    getGroupCaptureStatus = (group:Stone[]):boolean => {
        // let dummyGroups = this.groups.slice();
        // dummyGroups.push(group);
        
        // console.log('dummy groups')
        // console.log(dummyGroups)
        const opposingColorGroupIndexes = this.getOpposingColorGroupIndexes(group);
        const opposingColorGroupLibertyStatuses = opposingColorGroupIndexes
        .map(g => this.getGroupLibertyStatus(this.groups[g]));
        if(opposingColorGroupLibertyStatuses.some(s => s === 0)){
            const groupsToRemove:number[] = opposingColorGroupIndexes
            .filter(
                (g,i)=> 
                opposingColorGroupLibertyStatuses[i] === 0 
                );
                groupsToRemove.forEach(x => {
                    console.log('this.groups[x]')
                    console.log(this.groups[x])
                    this.removeCapturesByGroup(this.groups[x]);
                })
                console.log(true)
                return true;
            // then update liberty statuses...
        }else{
            return false;
        }
    }
    removeCapturesByGroup = (group:Stone[]):void => {
        for(let i = 0; i < group.length; i++){
            let theStone = group[i];
            let theIntersection = this.getIntersectionByStone(theStone);
            theIntersection.isClicked = !theIntersection.isClicked;
            theStone.clacked = !theStone.clacked;
            theIntersection.color = false;
            theIntersection.move = -1;
        }
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
    getOpposingColorGroupIndexes = (group:Stone[]):number[] => {
        let opposingColorGroupIndexes:number[] = [];
        for(let i = 0; i < group.length;i++){
            let currentStone = group[i];
            let opposingColorRelations = this.getStoneRelationships(currentStone)
            .filter(s => s.color !== currentStone.color)
            .map(cs => this.getGroupIndexByStone(cs));
            opposingColorGroupIndexes = opposingColorGroupIndexes
            .concat(opposingColorRelations)
        }
        let uniqueOpposingColorGroupIndexes:number[] = [];
        for(let i = 0; i < opposingColorGroupIndexes.length; i++){
            if(opposingColorGroupIndexes.indexOf(opposingColorGroupIndexes[i]) === i){
                uniqueOpposingColorGroupIndexes.push(opposingColorGroupIndexes[i]);
            }
        }
        return uniqueOpposingColorGroupIndexes;
    }
    getGroupColorRelationship = (stone:Stone):number[] => {
        const related = this.getStoneRelationships(stone);
        const colorRelationship = related //asdg
        .filter(s => s.color === stone.color);
        let colorRelatedIndexArray = this.getGroupRelationshipIndexesArray(colorRelationship);
        let uniqueArray:number[] = [];
        for(let i = 0; i < colorRelatedIndexArray.length; i++){
            if(colorRelatedIndexArray.indexOf(colorRelatedIndexArray[i]) === i){
                uniqueArray.push(colorRelatedIndexArray[i])
            }
        }
        return uniqueArray;
    }
    getGroupLibertyStatus = (group:Stone[]):number => {
        return group.reduce(
            (a,b)=> 
            b.liberty + a
            ,0)
    }
    getGroups = (stone:Stone):boolean => {
        const theIntersection = this.getIntersectionByStone(stone);
        if(stone.liberty === 4){
            this.groups.push([
                stone
            ]);
            
            return true;
        }
        
        const related = this.getStoneRelationships(stone);
        if(related.length === 0){
            this.groups.push([
                stone
            ]);
            return true;
        }
        for(let i = 0; i < related.length; i++){
            let currentRelatedStone = related[i];
            currentRelatedStone.liberty = this.getLiberties(currentRelatedStone);
        }
        const colorRelatedIndexArray = this.getGroupColorRelationship(stone);
        if(!colorRelatedIndexArray){
            const group = [stone];
            this.groups.push(group);
            this.getGroupCaptureStatus(group);
        }
        if(colorRelatedIndexArray.length === 1){ /// problems probably!!!!! ///
            const group = this.groups[ 
                colorRelatedIndexArray[0]
            ] 
            group.push(stone);
            this.getGroupCaptureStatus(group);
            
            return true;
        }else{
            let newGroupArray:Stone[] = [stone];
            for(let i = 0; i < colorRelatedIndexArray.length;i++){
                let currentIndex = colorRelatedIndexArray[i];
                newGroupArray = newGroupArray.concat(this.groups[currentIndex]);
            }
            if(this.getGroupLibertyStatus(newGroupArray) === 0 && !this.getGroupCaptureStatus(newGroupArray)){
                console.log('that was an illegal move!')
                return false;
            }
            this.groups = this.groups
            .filter(
                (g,i) => 
                !colorRelatedIndexArray
                .some(index => index === i)
                );
            this.groups.push(newGroupArray);
            this.getGroupCaptureStatus(newGroupArray);
            return true;
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
        console.log('group data')
        this.groups.forEach(g => {
            console.log(this.getGroupLibertyStatus(g));
            console.log(g);
        })
    }
    addStone = (stone:Stone):boolean => {
        
        if(this.getGroups(stone)){
            this.viewStones(stone);
            this.stones.push(stone);
            return true;
        }
        this.viewStones(stone);
        return false;
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
          for(let y = 1; y < 10; y++) {
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