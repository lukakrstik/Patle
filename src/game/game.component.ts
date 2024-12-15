import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { OPSHTINI } from '../opshtini';
import { Opshtina } from '../opshtina';
import {GraphService} from '../graph.service';
import {CommonModule, NgFor} from '@angular/common';
import {UserDataService} from '../user.service';
import {User} from '../user';
import {GameService} from '../game.service';

@Component({
  selector: 'app-game',
  imports: [CommonModule, NgFor],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit, AfterViewInit {
    private opstini: Opshtina[] = OPSHTINI;
    private shortestPath: string[] | null = []
    protected attempts: number = -1;
    public guessArray: Opshtina[] = [];
    @ViewChild("guess") private guessPrev: ElementRef | undefined;

    public opstiniArr: Opshtina[] = []
    protected userData!: User | null;
    private shortestCut: string[] | null;

    constructor(private graphService: GraphService, private userDataService: UserDataService, private gameService: GameService) {
      this.opstiniArr = gameService.loadDailyGame()
      this.shortestPath = this.graphService.findShortestPath(this.opstiniArr[0].id, this.opstiniArr[1].id)
      if(this.shortestPath != undefined) {
        this.attempts = Math.round((this.shortestPath?.length-2) * 1.4) + 1
      }
      console.log(this.shortestPath);
      this.shortestCut = this.shortestPath;
      this.shortestCut?.pop()
      this.shortestCut?.shift()
    }



    borderCheck(name: string) {
       if (this.shortestCut?.find(x => x === name)) return "green";
       let string = "/"
         // @ts-ignore
         this.shortestCut?.forEach((x) => {
           this.opstini.find(x => x.id === name)?.borders.forEach((y) => {
             if (x === y) string = "yellow";
           })
         });
       if(string == "/") return "red"
       else return "yellow"
    }

    attemptsCounter() {
      if(this.userData === undefined) {
        return 0;
      }
      else return this.userData?.attemptsToday.length
    }
    borders(id: string){

    }
    clearBorders(id: string){

    }

    @ViewChild("search") private search: ElementRef | undefined;
    guess(){
      this.gameService.makeGuess(this.search?.nativeElement.value);
      console.log(this.attempts)
      if(this.guessArray.length >= this.attempts){
        this.gameService.endGame()
      }
    }

    @ViewChild("map") private map: ElementRef | undefined;
    ngOnInit() {
      this.userDataService.userData$.subscribe((data) => {
        this.userData = data;
        if(this.map !== undefined && this.userData?.difficulty === "hard") {
          this.map.nativeElement.classList.add("hard");
        }
        if(this.map !== undefined && this.userData?.difficulty === "normal") {
          this.map.nativeElement.classList.remove("hard");
        }
        if(this.userData != undefined) {
          let arr  = []
          for (let a of this.userData.attemptsToday) {
            arr.push(this.opstini.find(x => x.id === a))
          }
          // @ts-ignore
          this.guessArray = arr
          this.guessArray.forEach((o) => {
            let el = document.getElementById(o.id);
            if(el != null) el.classList.add("guess");
          })
        }
      });
      if(this.userData === undefined) {

      }
    }

    ngAfterViewInit() {
      let startEl = document.getElementById(this.opstiniArr[0].id);
      let endEl = document.getElementById(this.opstiniArr[1].id);
      if(startEl && endEl){
        startEl.style.opacity = "100%";
        endEl.style.opacity = "100%";
        startEl.style.fill = "#FF8370";
        endEl.style.fill = "#98C39E";
      }
      if(this.map !== undefined && this.userData?.difficulty === "hard") {
        this.map.nativeElement.classList.add("hard");
      }
      if(this.map !== undefined && this.userData?.difficulty === "normal") {
        this.map.nativeElement.classList.remove("hard");
      }
      this.guessArray.forEach((o) => {
        let el = document.getElementById(o.id);
        if(el != null) el.classList.add("guess");
      })
    }
}
