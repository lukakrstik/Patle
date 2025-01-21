import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { OPSHTINI } from '../opshtini';
import { Opshtina } from '../opshtina';
import {GraphService} from '../graph.service';
import {CommonModule, NgFor} from '@angular/common';
import {UserDataService} from '../user.service';
import {User} from '../user';
import {GameService} from '../game.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-game',
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit, AfterViewInit {
    private opstini: Opshtina[] = OPSHTINI;
    public search: string = '';
    protected filteredOpshtini: { id: string; name: string }[] = [];
    private shortestPath: string[] | null = []
    protected attempts: number = -1;
    public guessArray: Opshtina[] = [];

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

    filterOpshtini(): void {
      const query = this.search.toLowerCase(); // Convert to lowercase for case-insensitive comparison

      this.filteredOpshtini = this.opstini.filter(opshtina =>
        opshtina.name.toLowerCase().includes(query) // Filter by Cyrillic name
      );
    }
    selectOpshtina(opshtina: { id: string; name: string }): void {
      console.log('Selected Municipality:', opshtina);
      // Handle selection logic here
      this.search = opshtina.name
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

    private lastScrollPosition = 0;

    @HostListener('focusin', ['$event'])
    onFocusIn(event: FocusEvent) {
      this.lastScrollPosition = window.scrollY || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.lastScrollPosition}px`;
    }

    @HostListener('focusout', ['$event'])
    onFocusOut(event: FocusEvent) {
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, this.lastScrollPosition);
    }

    borders(id: string){

    }
    clearBorders(id: string){

    }

    guess(){
      let guess = this.opstini?.find(x => x.name.toLowerCase() == this.search.toLowerCase())
      if(guess != undefined) this.gameService.makeGuess(guess.id);
      this.search = ""
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
      this.filteredOpshtini = this.opstini;
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
