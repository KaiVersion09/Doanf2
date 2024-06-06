import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent {
  constructor(
    public dialogRef: MatDialogRef<GameOverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string, score: number }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
