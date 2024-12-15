import {Component, OnInit} from '@angular/core';
import { SettingsComponent } from '../settings/settings.component';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {User} from '../user';
import {UserDataService} from '../user.service';
import {StatsComponent} from '../stats/stats.component';

@Component({
  selector: 'app-navbar',
  imports: [SettingsComponent, CommonModule, StatsComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  constructor(private userDataService: UserDataService) {
  }
  public settingShow = false;
  public statsShow = false;
  showSettings(){
    this.settingShow = true;
  }
  showStats(){
    this.statsShow = true;
  }
  hideModal() {
    this.settingShow = false;
    this.statsShow = false;
  }



  public userData!: User | null;

  ngOnInit(): void {
    this.userDataService.userData$.subscribe((data) => {
      this.userData = data;
    });
  }
}
