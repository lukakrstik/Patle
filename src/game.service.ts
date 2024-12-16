import { Injectable } from '@angular/core';
import {GraphService} from './graph.service';
import {UserDataService} from './user.service';
import { Opshtina } from './opshtina';
import { OPSHTINI } from './opshtini';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private opstini: Opshtina[] = OPSHTINI;
  constructor(private graphService: GraphService, private userDataService: UserDataService) {

  }

  endGame(): void{
    let user = this.userDataService.getUserData()
    if(user && !user.dailyGameCompleted) {
      this.userDataService.updateUserData({dailyGameCompleted: true, gamesPlayed: user.gamesPlayed + 1, streak: user.streak+1 });
      console.log("END")
    }
  }

  winGame(): void {
    console.log("Win Game");
    let user = this.userDataService.getUserData()
    if(user) {
      this.userDataService.updateUserData({dailyGameCompleted: true, gamesPlayed: user.gamesPlayed + 1, streak: user.streak+1, wins: user.wins + 1});
    }

  }
  winCheck(): void {
    let user = this.userDataService.getUserData();
    let arr = this.loadDailyGame();
    let attempts = user?.attemptsToday || [];

    // Get the full graph of municipalities
    let graph = this.graphService.getGraph();

    let start = arr[0].id;

    // Initialize a queue for BFS and a visited set
    let queue: string[] = [start];
    let visited: Set<string> = new Set();



    // BFS loop to check if there's a path from start to end
    while (queue.length > 0) {
      let current = queue.shift()!;



      // If we reach the destination municipality, it's a win
      if (arr[1].borders.includes(current)) {
        this.winGame();
        return;
      }

      // Mark the current municipality as visited
      visited.add(current);

      // Get neighbors (borders) for the current municipality, guard against undefined
      let neighbors = graph[current] || [];

      // Only process neighbors if they exist and are an array

        // Add all unvisited neighbors that are in the user's guesses to the queue
        neighbors.borders.forEach(neighbor => {
          if (!visited.has(neighbor) && attempts.includes(neighbor)) {
            queue.push(neighbor);
          }
        });
      }
  }

  makeGuess(search : string){
      let user = this.userDataService.getUserData()
      if(user && !user.attemptsToday.includes(search)) {
        user?.attemptsToday.push(search);
        this.userDataService.updateUserData({attemptsToday: user.attemptsToday});
      }
      this.winCheck();
  }
  loadDailyGame(){
    let arr = this.calculateDailyGame()
    if(arr[0] !== this.userDataService.getUserData()?.todayGame[0]){
      this.userDataService.updateUserData({attemptsToday: [], dailyGameCompleted: false, todayGame: arr});
    }
    return [this.opstini[arr[0]], this.opstini[arr[1]]];
  }

  calculateDailyGame(){
    const today = new Date();
    today.setHours(today.getHours() + 1);
    const startOfEpoch = new Date('2024-10-10'); // Define the start date of your challenges
    const dayDifference = Math.floor(
      (today.getTime() - startOfEpoch.getTime()) / (1000 * 60 * 60 * 24)
    );

    let index1 = dayDifference % this.opstini.length;
    let index2 = (dayDifference * 31) % this.opstini.length; // Use a different multiplier for variability

    let distance = this.graphService.findShortestPath(this.opstini[index1].id, this.opstini[index2].id)?.length
    if (distance !== undefined && distance < 5) {
      for (let i = 0; i < this.opstini.length; i++) {
        if (distance !== undefined && distance < 5) {
          index2 = index2 + 1 % this.opstini.length;
        }
        distance = this.graphService.findShortestPath(this.opstini[index1].id, this.opstini[index2].id)?.length
      }
    }
    return [index1, index2];
  }
}
