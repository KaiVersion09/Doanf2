import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameOverComponent } from './game-over/game-over.component';
import { LeaderboardService } from './leaderboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'snake'; // Tiêu đề của ứng dụng
  static startCoordinates = 0; // Tọa độ khởi đầu của trò chơi
  static rowLength = 30; // Độ dài hàng và cột của lưới
  static snakeLength = 6; // Độ dài ban đầu của con rắn
  static obstacleCount = 10; // Số lượng chướng ngại vật

  gridArray: string[] = []; // Mảng lưu trữ tất cả các ô trong lưới
  snakeArray: string[] = []; // Mảng lưu trữ các ô mà con rắn chiếm giữ
  obstacleArray: string[] = []; // Mảng lưu trữ tất cả các ô chứa chướng ngại vật
  headCoordinates = { row: AppComponent.startCoordinates, column: AppComponent.snakeLength - 1 }; // Tọa độ của đầu con rắn
  apple = ''; // Tọa độ của quả táo
  lastMove = 'undefined'; // Hướng di chuyển cuối cùng của con rắn
  scoreBoard = 0; // Điểm của người chơi
  playerName = ''; // Tên của người chơi
  gameMode = 'easy'; // Chế độ chơi (dễ, trung bình, khó)
  isGameStarted = false; // Trạng thái trò chơi đã bắt đầu hay chưa
  isGameActive = true; // Trạng thái trò chơi đang hoạt động hay không
  previousScores: { name: string; score: number }[] = []; // Danh sách điểm cao trước đó

  constructor(
    private snackBar: MatSnackBar, // Dịch vụ hiển thị snack bar
    private dialog: MatDialog, // Dịch vụ hiển thị hộp thoại
    private leaderboardService: LeaderboardService // Dịch vụ quản lý bảng xếp hạng
  ) { }

  ngOnInit(): void {
    this.loadPreviousScores(); // Khi ứng dụng khởi chạy, tải danh sách điểm cao trước đó
  }

  // Hàm bắt đầu trò chơi
  startGame() {
    // Kiểm tra xem người chơi đã nhập tên hay chưa
    if (this.playerName.trim() === '') {
      this.displaySnack('Vui lòng nhập tên của bạn');
      return;
    }
    this.isGameStarted = true; // Đánh dấu trò chơi đã bắt đầu
    this.isGameActive = true; // Đánh dấu trò chơi đang hoạt động

    // Thiết lập số lượng chướng ngại vật tùy thuộc vào chế độ chơi
    if (this.gameMode === 'easy') {
      AppComponent.obstacleCount = 0;
    } else if (this.gameMode === 'medium') {
      AppComponent.obstacleCount = 5;
    } else if (this.gameMode === 'hard') {
      AppComponent.obstacleCount = 10;
    }

    this.initializeGame(); // Khởi tạo trò chơi
  }

  // Hàm khởi tạo trò chơi
  initializeGame() {
    this.gridArray = []; // Đặt lại mảng lưới
    this.snakeArray = []; // Đặt lại mảng con rắn
    this.obstacleArray = []; // Đặt lại mảng chướng ngại vật
    this.headCoordinates = { row: AppComponent.startCoordinates, column: AppComponent.snakeLength - 1 }; // Đặt lại tọa độ đầu con rắn
    this.apple = ''; // Đặt lại tọa độ quả táo
    this.lastMove = 'undefined'; // Đặt lại hướng di chuyển cuối cùng
    this.scoreBoard = 0; // Đặt lại điểm số

    // Điền lưới với ô trống
    this.fillGrid();
    // Điền con rắn vào lưới
    this.fillSnake();
    // Đặt chướng ngại vật vào lưới
    this.placeObstacles();
    // Đặt quả táo vào lưới
    this.placeApple();
    // Xử lý di chuyển con rắn bằng các phím mũi tên
    this.moveWithArrowButtons();

    // Hiển thị hướng dẫn chơi
    setTimeout(() => {
      if (this.lastMove !== '') {
        this.displaySnack('Sử dụng các phím mũi tên để di chuyển con rắn');
      }
    }, 1500);

    // Hiển thị gợi ý
    setTimeout(() => {
      if (this.lastMove !== '') {
        this.displaySnack('Thu thập càng nhiều điểm càng tốt "GOOD LUCK"');
      }
    }, 8000);
  }

  // Hiển thị snack bar với thông báo cho người chơi
  displaySnack(message: string) {
    this.snackBar.open(message, 'Tắt thông báo', { duration: 3000 });
  }

  // Điền lưới với ô trống
  fillGrid() {
    for (let i = 0; i < AppComponent.rowLength; i++) {
      for (let x = 0; x < AppComponent.rowLength; x++) {
        this.gridArray.push(`${i}:${x}`);
      }
    }
  }

  fillSnake() {
    let direction: number;
    let startRow: number;
    let startCol: number;
    let validPosition: boolean;

    do {
      direction = Math.floor(Math.random() * 4);
      startRow = Math.floor(Math.random() * AppComponent.rowLength);
      startCol = Math.floor(Math.random() * AppComponent.rowLength);
      this.snakeArray = [];

      const snakePositions: string[] = [];
      for (let i = 0; i < AppComponent.snakeLength; i++) {
        if (direction === 0 && startCol + AppComponent.snakeLength <= AppComponent.rowLength) {
          snakePositions.push(`${startRow}:${startCol + i}`);
          this.headCoordinates = { row: startRow, column: startCol + AppComponent.snakeLength - 1 };
        } else if (direction === 1 && startRow + AppComponent.snakeLength <= AppComponent.rowLength) {
          snakePositions.push(`${startRow + i}:${startCol}`);
          this.headCoordinates = { row: startRow + AppComponent.snakeLength - 1, column: startCol };
        } else if (direction === 2 && startCol - AppComponent.snakeLength >= -1) {
          snakePositions.push(`${startRow}:${startCol - i}`);
          this.headCoordinates = { row: startRow, column: startCol - AppComponent.snakeLength + 1 };
        } else if (direction === 3 && startRow - AppComponent.snakeLength >= -1) {
          snakePositions.push(`${startRow - i}:${startCol}`);
          this.headCoordinates = { row: startRow - AppComponent.snakeLength + 1, column: startCol };
        }
      }

      this.snakeArray = snakePositions;
      validPosition = this.snakeArray.every(coordinate => !this.obstacleArray.includes(coordinate)) && this.snakeArray.length === AppComponent.snakeLength;
    } while (!validPosition);
  }

  placeObstacles() {
    for (let i = 0; i < AppComponent.obstacleCount; i++) {
      let obstacleCoordinates: string[] = [];
      let validPosition: boolean;

      do {
        obstacleCoordinates = this.generateComplexObstacle();
        validPosition = obstacleCoordinates.every(coord => !this.snakeArray.includes(coord) && !this.obstacleArray.includes(coord));
      } while (!validPosition);

      this.obstacleArray.push(...obstacleCoordinates);
    }
  }

  generateComplexObstacle(): string[] {
    const length = Math.floor(Math.random() * 5) + 3;
    const directionChange = Math.floor(Math.random() * (length - 2)) + 1;
    let direction = Math.floor(Math.random() * 4);
    let row = Math.floor(Math.random() * AppComponent.rowLength);
    let column = Math.floor(Math.random() * AppComponent.rowLength);
    const obstacle: string[] = [];

    for (let i = 0; i < length; i++) {
      obstacle.push(`${row}:${column}`);

      if (i === directionChange) {
        direction = (direction + 1) % 4;
      }

      if (direction === 0 && column + 1 < AppComponent.rowLength) {
        column++;
      } else if (direction === 1 && row + 1 < AppComponent.rowLength) {
        row++;
      } else if (direction === 2 && column - 1 >= 0) {
        column--;
      } else if (direction === 3 && row - 1 >= 0) {
        row--;
      } else {
        break;
      }
    }

    return obstacle;
  }

  placeApple() {
    this.apple = this.getRandomCoordinate();
    while (this.snakeArray.includes(this.apple) || this.obstacleArray.includes(this.apple)) {
      this.apple = this.getRandomCoordinate();
    }
  }

  getRandomCoordinate() {
    return `${Math.floor(Math.random() * AppComponent.rowLength)}:${Math.floor(Math.random() * AppComponent.rowLength)}`;
  }

  moveWithArrowButtons() {
    const checkKey = (e: KeyboardEvent) => {
      if (!this.isGameActive) return;

      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') this.moveUp();
      if (key === 's' || key === 'arrowdown') this.moveDown();
      if (key === 'a' || key === 'arrowleft') this.moveLeft();
      if (key === 'd' || key === 'arrowright') this.moveRight();
    };
    document.onkeydown = checkKey;
  }

  moveRight() {
    if (this.lastMove !== 'left') {
      this.lastMove = 'right';
      this.moveSnake(0, 1);
      setTimeout(() => this.lastMove === 'right' && this.moveRight(), 300);
    }
  }

  moveLeft() {
    if (this.lastMove !== 'right') {
      this.lastMove = 'left';
      this.moveSnake(0, -1);
      setTimeout(() => this.lastMove === 'left' && this.moveLeft(), 300);
    }
  }

  moveUp() {
    if (this.lastMove !== 'down') {
      this.lastMove = 'up';
      this.moveSnake(-1, 0);
      setTimeout(() => this.lastMove === 'up' && this.moveUp(), 300);
    }
  }

  moveDown() {
    if (this.lastMove !== 'up') {
      this.lastMove = 'down';
      this.moveSnake(1, 0);
      setTimeout(() => this.lastMove === 'down' && this.moveDown(), 300);
    }
  }

  moveSnake(plusRow: number, plusColumn: number) {
    this.headCoordinates.row += plusRow;
    this.headCoordinates.column += plusColumn;

    const headCoordinatesString = `${this.headCoordinates.row}:${this.headCoordinates.column}`;
    this.checkBorders();

    if (this.snakeArray.includes(headCoordinatesString) || this.obstacleArray.includes(headCoordinatesString)) {
      this.showGameOverDialog();
      return;
    }

    this.snakeArray.push(headCoordinatesString);

    if (headCoordinatesString !== this.apple) {
      this.snakeArray.shift();
    } else {
      this.scoreBoard += 10;
      this.placeApple();
    }
  }

  checkBorders() {
    if (
      this.headCoordinates.row >= AppComponent.rowLength ||
      this.headCoordinates.column >= AppComponent.rowLength ||
      this.headCoordinates.row < AppComponent.startCoordinates ||
      this.headCoordinates.column < AppComponent.startCoordinates
    ) {
      this.showGameOverDialog();
    }
  }

  showGameOverDialog() {
    this.isGameActive = false;
    this.lastMove = '';
    this.leaderboardService.addScore(this.playerName, this.scoreBoard);
    this.loadPreviousScores(); // Cập nhật bảng xếp hạng trước khi mở hộp thoại kết thúc trò chơi
    const dialogRef = this.dialog.open(GameOverComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: { name: this.playerName, score: this.scoreBoard }
    });
  
    dialogRef.afterClosed().subscribe(() => {
      this.resetGame();
      this.loadPreviousScores(); 
    });
  }
  
  resetGame() {
    this.playerName = '';
    this.isGameStarted = false;
  }

  loadPreviousScores() {
    this.previousScores = this.leaderboardService.getLeaderboard();
  }
}
