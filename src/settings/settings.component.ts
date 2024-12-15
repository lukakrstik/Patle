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
import {UserDataService} from '../user.service';
import {User} from '../user';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements AfterViewInit, OnInit{

  @Output() close = new EventEmitter<void>();
  closeModal(): void {
    this.close.emit();
  }
  private userData!: User | null;

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    this.userDataService.userData$.subscribe((data) => {
      this.userData = data;
    });
  }

  setTheme(){
    if(this.userData !== null && this.userData.theme == "light") {
      this.userData.theme = "dark"
      this.userDataService.updateUserData({ theme: this.userData.theme});
    }
    else if(this.userData !== null && this.userData.theme == "dark") {
      this.userData.theme = "light"
      this.userDataService.updateUserData({ theme: this.userData.theme});
    }
    this.userData = this.userDataService.getUserData();
  }

  setDifficulty(){
    if(this.userData !== null && this.userData.difficulty == "normal") {
      this.userData.difficulty = "hard"
      this.userDataService.updateUserData({ difficulty: this.userData.difficulty});
    }
    else if(this.userData !== null && this.userData.difficulty == "hard") {
      this.userData.difficulty = "normal"
      this.userDataService.updateUserData({ difficulty: this.userData.difficulty});
    }
    this.userData = this.userDataService.getUserData();
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

  @ViewChild("themecheck") private checkboxtheme: ElementRef | undefined;
  @ViewChild("hardmode") private hardmode: ElementRef | undefined;
  ngAfterViewInit(){
    if(this.userData !== null && this.userData.theme == "dark" && this.checkboxtheme !== undefined) {
      this.checkboxtheme.nativeElement.checked = true;
    }
    if(this.userData !== null && this.userData.difficulty == "hard" && this.hardmode !== undefined) {
      this.hardmode.nativeElement.checked = true;
    }
  }
}
