import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GameService } from '../services/game.service';
import { Intersection } from '../shared/intersection.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  service:GameService;
  intersections:Intersection[] = [];
  move:number = 0;
  @Output()clackEvent: 
  EventEmitter<any> = new EventEmitter<{intersection:Intersection}>();
  
  constructor(service:GameService) { 
    this.service = service;
    this.intersections = this.service.intersections;
  }
  onClick = (intersection:any) => {
    if(intersection.isClicked){
      return;
    }
    this.move++;
    intersection.isClicked = true;
    intersection.move = this.move;
    intersection.color = this.move % 2 !== 0;
    
    
    this.service.addStone(this.service.giveStone(intersection));
  }
  
  ngOnInit(): void {
    
  }

}
