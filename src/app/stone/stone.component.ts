import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';
import {Stone} from '../shared/stone.model'
@Component({
  selector: 'app-stone',
  templateUrl: './stone.component.html',
  styleUrls: ['./stone.component.css']
})
export class StoneComponent implements OnInit {
  service:GameService;
  @Input()isClicked:boolean = false;
  @Input()stoneModel:any;
  whiteImage:string = 
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Realistic_go_stone_render_-_white.svg/250px-Realistic_go_stone_render_-_white.svg.png?20211230170229';
  blackImage:string = 
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Realistic_go_stone_render_-_black.svg/250px-Realistic_go_stone_render_-_black.svg.png?20211230170802';
  constructor(service:GameService){
    this.service = service;
  }
  getColor = ():string => {
    if(!this.stoneModel){
      return '';
    }
    return !this.stoneModel.color ? this.whiteImage : this.blackImage;
  }
  ngOnInit(): void {

  }

}
