import { Injectable } from '@angular/core';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly storageKey = 'userData';

  constructor() {}


  setUserData(data: User): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }


  getUserData(): User | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }


  getDefaultUserData(): User {
    return {
      dailyGameCompleted: false,
      theme: 'light',
      difficulty: 'normal',
      stats: { attempts: [], idealAttempts: [] },
      streak: 0,
      wins: 0,
      gamesPlayed: 0,
      attemptsToday: [],
      todayGame: []
    };
  }
}
