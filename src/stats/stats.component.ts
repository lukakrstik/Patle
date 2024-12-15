import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {User} from '../user';
import {UserDataService} from '../user.service';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements AfterViewInit, OnInit {

  public winPercentage = 0;
  @Output() close = new EventEmitter<void>();
  closeModal(): void {
    this.close.emit();
  }
  public userData!: User | null;

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    this.userDataService.userData$.subscribe((data) => {
      this.userData = data;
      // @ts-ignore
      this.winPercentage = data?.wins/data?.gamesPlayed;
    });
    // @ts-ignore
    console.log(this.userData?.wins / this.userData?.gamesPlayed);
    if(this.userData) {
      this.winPercentage = this.userData?.wins / this.userData?.gamesPlayed;
    }
  }





  @ViewChild("modal") private modal: ElementRef | undefined;
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if(this.modal !== undefined) {
      if (!this.modal.nativeElement.contains(event.target)) {
        this.closeModal()
      }
    }
  }

  ngAfterViewInit(){

  }

}
