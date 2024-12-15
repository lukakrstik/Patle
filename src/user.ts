export interface User {
  dailyGameCompleted: boolean; //Win Game / Lost Game
  theme: 'dark' | 'light';
  difficulty: 'hard' | 'normal';
  stats: {
    attempts: number[];
    idealAttempts: number[];
  };
  streak: number; //Win / Lost Game
  wins: number; //Win
  gamesPlayed: number; //Win / Lost Game
  attemptsToday: string[];
  todayGame: number[];
}
