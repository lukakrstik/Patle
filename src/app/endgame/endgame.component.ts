import {Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';
import {UserDataService} from '../../user.service';
import {User} from '../../user';

@Component({
  selector: 'app-endgame',
  imports: [],
  templateUrl: './endgame.component.html',
  styleUrl: './endgame.component.css'
})
export class EndgameComponent implements OnInit {

  private userData!: User | null;
  constructor(private userDataService: UserDataService) {}

  @Output() close = new EventEmitter<void>();
  closeModal(): void {
    this.close.emit();
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

  ngOnInit(): void {
    this.userDataService.userData$.subscribe((data) => {
      this.userData = data;
    });
  }
}
