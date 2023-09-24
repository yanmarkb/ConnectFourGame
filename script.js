class Player {
	constructor(color) {
		this.color = color;
	}
}

class Game {
	constructor() {
		this.WIDTH = 7;
		this.HEIGHT = 6;
		this.currPlayer = null;
		this.board = [];
		this.gameOver = false;
		this.startButton = document.getElementById("start-button");
		this.gameOverMessage = document.getElementById("game-over-message");
		this.colorForm = document.getElementById("color-form");
		this.colorForm.addEventListener("submit", this.setPlayerColors.bind(this));
		this.startButton.addEventListener("click", this.start.bind(this));
		this.createBoard();
	}

	// Initialize the game board
	createBoard() {
		this.board = [];
		for (let y = 0; y < this.HEIGHT; y++) {
			this.board.push(Array.from({ length: this.WIDTH }));
		}
	}

	// Set player colors and start the game
	setPlayerColors(event) {
		event.preventDefault();
		const player1Color = document.getElementById("player1-color").value;
		const player2Color = document.getElementById("player2-color").value;
		this.player1 = new Player(player1Color);
		this.player2 = new Player(player2Color);
		this.start();
	}

	// Start or restart the game
	start() {
		this.createBoard();
		this.currPlayer = this.player1;
		this.gameOver = false;
		this.gameOverMessage.textContent = "";
		this.colorForm.style.display = "none";
		this.drawBoard();
	}

	// Create the game board in the HTML
	drawBoard() {
		const board = document.getElementById("board");
		board.innerHTML = "";

		// Create clickable column tops
		const top = document.createElement("tr");
		top.setAttribute("id", "column-top");
		top.addEventListener("click", this.handleClick.bind(this));

		for (let x = 0; x < this.WIDTH; x++) {
			const headCell = document.createElement("td");
			headCell.setAttribute("id", x);
			top.append(headCell);
		}

		board.append(top);

		// Create the main game board
		for (let y = 0; y < this.HEIGHT; y++) {
			const row = document.createElement("tr");

			for (let x = 0; x < this.WIDTH; x++) {
				const cell = document.createElement("td");
				cell.setAttribute("id", `${y}-${x}`);
				row.append(cell);
			}

			board.append(row);
		}
	}
	findSpotForCol(x) {
		for (let y = this.HEIGHT - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}

	async placeInTable(y, x) {
		const piece = document.createElement("div");
		piece.classList.add("piece");
		piece.style.backgroundColor = this.currPlayer.color;
		piece.style.top = "-50px"; // Start above the board
		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);

		await new Promise((resolve) => setTimeout(resolve, 100)); // Delay for animation

		piece.style.top = "0"; // Animate the piece to drop
	}

	// End the game and display a message
	endGame(msg) {
		this.gameOverMessage.textContent = msg;
		this.gameOver = true;
		this.colorForm.style.display = "block";
	}

	// Check if a player has won
	checkForWin() {
		function _win(cells) {
			return cells.every(
				([y, x]) =>
					y >= 0 &&
					y < this.HEIGHT &&
					x >= 0 &&
					x < this.WIDTH &&
					this.board[y][x] === this.currPlayer
			);
		}

		for (let y = 0; y < this.HEIGHT; y++) {
			for (let x = 0; x < this.WIDTH; x++) {
				const horiz = [
					[y, x],
					[y, x + 1],
					[y, x + 2],
					[y, x + 3],
				];
				const vert = [
					[y, x],
					[y + 1, x],
					[y + 2, x],
					[y + 3, x],
				];
				const diagDR = [
					[y, x],
					[y + 1, x + 1],
					[y + 2, x + 2],
					[y + 3, x + 3],
				];
				const diagDL = [
					[y, x],
					[y + 1, x - 1],
					[y + 2, x - 2],
					[y + 3, x - 3],
				];

				if (
					_win.call(this, horiz) ||
					_win.call(this, vert) ||
					_win.call(this, diagDR) ||
					_win.call(this, diagDL)
				) {
					return true;
				}
			}
		}
	}

	// Handle a player's move
	async handleClick(evt) {
		if (this.gameOver) return;

		const x = +evt.target.id;
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}

		this.board[y][x] = this.currPlayer;
		await this.placeInTable(y, x);

		if (this.checkForWin()) {
			return this.endGame(
				`Player ${this.currPlayer === this.player1 ? 1 : 2} won!`
			);
		}

		if (this.board.every((row) => row.every((cell) => cell))) {
			return this.endGame("Tie!");
		}

		this.currPlayer =
			this.currPlayer === this.player1 ? this.player2 : this.player1;
	}
}

const game = new Game();

//hi
