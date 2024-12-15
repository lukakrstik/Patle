import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { GameComponent } from '../game/game.component';
import { UserDataService } from '../user.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, GameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private userDataService: UserDataService) {}


  ngOnInit(): void {
    // User data is initialized in UserDataService
    console.log('App initialized with user data:', this.userDataService.getUserData());
    this.userDataService.userData$.subscribe((data) => {
      if(data !== null) {
        document.documentElement.setAttribute('data-theme', data.theme);
      }
    });
  }
}
