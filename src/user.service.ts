import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private userDataSubject = new BehaviorSubject<User | null>(null);

  userData$ = this.userDataSubject.asObservable();

  constructor(private localStorageService: DataService) {
    // Initialize user data from localStorage or defaults
    const initialData = this.localStorageService.getUserData() || this.localStorageService.getDefaultUserData();
    this.userDataSubject.next(initialData);
  }

  // Get current user data value
  getUserData(): User | null {
    return this.userDataSubject.value;
  }

  // Update user data and persist to localStorage
  updateUserData(partialData: Partial<User>): void {
    const currentData = this.getUserData()!;
    const updatedData = { ...currentData, ...partialData };
    this.userDataSubject.next(updatedData);
    this.localStorageService.setUserData(updatedData);
  }

  // Reset user data to defaults
  resetUserData(): void {
    const defaultData = this.localStorageService.getDefaultUserData();
    this.userDataSubject.next(defaultData);
    this.localStorageService.setUserData(defaultData);
  }
}
