import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private leaderboardKey = 'leaderboard';
  private maxEntries = 5; // Số lượng bản ghi tối đa cần hiển thị

  constructor() { }

  getLeaderboard(): { name: string; score: number }[] {
    const leaderboardString = localStorage.getItem(this.leaderboardKey);
    let leaderboard: { name: string; score: number }[] = [];
    if (leaderboardString) {
      leaderboard = JSON.parse(leaderboardString);
    }
    return leaderboard.slice(0, this.maxEntries); // Trả về chỉ 5 bản ghi đầu tiên
  }

  addScore(name: string, score: number): void {
    const leaderboard = this.getLeaderboard();
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem(this.leaderboardKey, JSON.stringify(leaderboard));
  }
}
