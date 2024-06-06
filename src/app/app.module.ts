import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GameOverComponent } from './game-over/game-over.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component'; // Import the LeaderboardComponent
import { LeaderboardService } from './leaderboard.service'; // Import the LeaderboardService

@NgModule({
  declarations: [
    AppComponent,
    GameOverComponent,
    LeaderboardComponent // Declare the LeaderboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule
  ],
  providers: [LeaderboardService], // Provide the LeaderboardService
  bootstrap: [AppComponent]
})
export class AppModule { }
