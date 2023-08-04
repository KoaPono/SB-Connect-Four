/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
	constructor(height = 6, width = 7) {
		this.width = width;
		this.height = height;
		this.currPlayer = 1;
		this.board = [];
		this.gameOver = false;

		this.makeBoard();
		this.makeHtmlBoard();
	}

	makeBoard() {
		const { width, height } = this;
		for (let y = 0; y < height; y++) {
			this.board.push(Array.from({ length: width }));
		}
	}

	makeHtmlBoard() {
		const { width, height } = this;
		const board = document.getElementById("board");

		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement("tr");
		top.setAttribute("id", "column-top");
		top.addEventListener("click", this.handleClick.bind(this));

		for (let x = 0; x < width; x++) {
			const headCell = document.createElement("td");
			headCell.setAttribute("id", x);
			top.append(headCell);
		}

		board.append(top);

		// make main part of board
		for (let y = 0; y < height; y++) {
			const row = document.createElement("tr");

			for (let x = 0; x < width; x++) {
				const cell = document.createElement("td");
				cell.setAttribute("id", `${y}-${x}`);
				row.append(cell);
			}

			board.append(row);
		}
	}

	findSpotForCol(x) {
		const { height, board } = this;
		for (let y = height - 1; y >= 0; y--) {
			if (!board[y][x]) {
				return y;
			}
		}
		return null;
	}

	placeInTable(y, x) {
		let { currPlayer } = this;
		const piece = document.createElement("div");
		piece.classList.add("piece");
		piece.classList.add(`p${currPlayer}`);
		piece.style.top = -50 * (y + 2);

		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}

	endGame(msg) {
		this.gameOver = true;
		alert(msg);
	}

	checkForWin() {
		const { width, height } = this;
		let { currPlayer, board } = this;
		function _win(cells) {
			// Check four cells to see if they're all color of current player
			//  - cells: list of four (y, x) cells
			//  - returns true if all are legal coordinates & all match currPlayer

			return cells.every(
				([y, x]) =>
					y >= 0 &&
					y < height &&
					x >= 0 &&
					x < width &&
					board[y][x] === currPlayer
			);
		}

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
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

				// find winner (only checking each win-possibility as needed)
				if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
					return true;
				}
			}
		}
	}

	handleClick(evt) {
		if (!this.gameOver) {
			let { currPlayer } = this;
			const { board } = this;
			// get x from ID of clicked cell
			const x = +evt.target.id;

			// get next spot in column (if none, ignore click)
			const y = this.findSpotForCol(x);
			if (y === null) {
				return;
			}

			// place piece in board and add to HTML table
			board[y][x] = currPlayer;
			this.placeInTable(y, x);

			// check for win
			if (this.checkForWin()) {
				return this.endGame(`Player ${currPlayer} won!`);
			}

			// check for tie
			if (board.every((row) => row.every((cell) => cell))) {
				return this.endGame("Tie!");
			}

			// switch players
			this.currPlayer = currPlayer === 1 ? 2 : 1;
		}
	}
}

const startButton = document.getElementById("gameStart");
const boardElement = document.getElementById("board");

const startGame = () => {
  console.log(boardElement.childNodes);
	clearBoard();
  console.log(boardElement.childNodes);
	new Game();
};

const clearBoard = () => {
  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.firstChild);
  }
};

startButton.addEventListener("click", startGame);
