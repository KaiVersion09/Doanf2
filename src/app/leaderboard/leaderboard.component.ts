import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '../leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: { name: string, score: number }[] = [];

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    this.leaderboard = this.leaderboardService.getLeaderboard();
  }
}
