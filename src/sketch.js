//set up the game board
let board = {
	tiles: [],
	turn: 0,
	over: false,
	tie: false,
	playerTurn: 1,
	rows: 6,
	cols: 7,
	boxSize: 60,
	spacing: 90.0,
	gab: 0, //this.spacing - this.boxSize,
	minX: 0, // this.gab / 2,
	maxX: 0, // this.spacing * this.cols + this.gab,
	minY: 0, // this.gab / 2 + this.boxSize
	maxY: 0,
};

let player1playerTurn = true;
let colors = {};

board.gab = board.spacing - board.boxSize;
board.minX = board.gab / 2;
board.maxX = board.spacing * board.cols + board.gab / 2;
board.minY = board.gab / 2;
board.maxY = board.spacing * (board.rows + 0) + board.gab / 2;

// canvas size
let maxHight = board.maxY + board.gab / 2;
let maxWidth = board.maxX + board.gab / 2; //(board.rows + 1) * board.spacing + board.gab;

function setup() {
	board.reset();
	// createCanvas(maxWidth, maxHight);
	// board.tiles = [
	// 	[0, 0, 0, 0, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0]
	// ];

	colors = {
		dropRow: color(150),
		empty: color(255, 255, 255, 0),
		player1: color(255, 127, 80),
		player2: color(65, 105, 225),
		boarder: color(150),
		text: color(75),
	};
}

function draw() {
	board.drawGameBoard();
}

board.reset = () => {
	createCanvas(maxWidth, maxHight);

	board.over = false;
	for (let row = 0; row < board.rows; row++) {
		board.tiles[row] = [];
		for (let col = 0; col < board.cols; col++) {
			board.tiles[row][col] = 0;
		}
	}

	let title = document.querySelector("#title");
	title.textContent = "Press a button or a number key to drop a token";
	title.style.color = "black";

	let playerText = document.querySelector("#player");
	playerText.textContent = "Player 1's Turn";
	playerText.style.color = colors.player1;
};

board.drawBoarder = () => {
	stroke(colors.boarder);

	//horizontal lines
	line(board.minX, board.minY, board.maxX, board.minY);

	for (let i = 0; i < board.cols - 1; i++) {
		let below =
			(i + 1) * board.boxSize +
			board.gab * i +
			board.boxSize / 2 +
			board.gab / 2;
		line(board.minX, below, board.maxX, below);
	}

	//vertical lines
	line(board.gab / 2, board.minY, board.gab / 2, board.maxY);
	for (let j = 0; j < board.cols; j++) {
		let center = (j + 1) * board.boxSize + board.gab * j;
		let left =
			(j + 1) * board.boxSize +
			board.gab * j +
			board.boxSize / 2 +
			board.gab / 2;
		//center
		stroke(colors.dropRow);
		// line(center, 0, center, maxHight);

		//left
		stroke(colors.boarder);
		line(left, board.minY, left, board.maxY);

		// //text
		// noStroke();
		// fill(colors.text);
		// text(j + 1, center, board.boxSize / 2);
	}
};

board.drawGameBoard = () => {
	//boarder
	board.drawBoarder();

	//boxes
	for (let i = 0; i < board.tiles.length; i++) {
		const row = board.tiles[i];
		//label the cols
		noStroke();
		//Draw the tiles
		for (let j = 0; j < row.length; j++) {
			const tile = row[j];
			noStroke();
			if (tile == 1) {
				fill(colors.player1);
			} else if (tile == 2) {
				fill(colors.player2);
			} else {
				fill(colors.empty);
			}
			square(
				board.spacing * j + board.gab,
				board.spacing * (i + 1) - 2 * board.gab,
				board.boxSize
			);
		}
	}
};

board.checkWin = (player, row, col) => {
	console.log("Player #", player);
	console.log("Row: ", row);
	console.log("Colum: ", col);

	//Win checker
	let horizontal = board.checkHorizontal(player, row, col);
	let vertical = board.checkVertical(player, row, col);
	let L2RDiagonal = board.checkL2RDiagonal(player, row, col);
	let R2LDiagonal = board.checkR2LDiagonal(player, row, col);

	if (vertical || horizontal || L2RDiagonal || R2LDiagonal) {
		board.over = true;
	}

	if (board.over) {
		console.log("Player ", player, " has won!");
		console.log("playerTurn: ", board.playerTurn);
	}
};

board.isTie = () => {};

board.checkHorizontal = (player, row, col) => {
	// Horizontal
	let pLeft = 0;
	let mLeft = col - 4 > 0 ? col - 4 : 0;

	let pRight = 0;
	let mRight =
		col + 4 < board.tiles[0].length ? col + 4 : board.tiles[0].length - 1;

	console.log("Left Max Col: ", mLeft);
	console.log("Right Max col: ", mRight);

	// Left Count
	console.log("Left Count");
	for (let j = col - 1; j >= mLeft; j--) {
		const wTile = board.tiles[row][j];
		console.log("Tile @ (", row, " ", j, ") =", wTile);

		if (wTile == player) {
			pLeft++;
		} else {
			break;
		}
	}
	console.log("Pieces to the Left: ", pLeft);

	// Right Count
	console.log("Right Count");
	for (let j = col + 1; j <= mRight; j++) {
		const wTile = board.tiles[row][j];
		console.log("Tile @ (", row, " ", j, ") =", wTile);

		if (wTile == player) {
			pRight++;
		} else {
			break;
		}
	}
	console.log("Pieces to the Right: ", pRight);
	console.log("Number of Horizontal Pieces = ", pRight + pLeft);

	return pLeft + pRight >= 3;
};

board.checkVertical = (player, row, col) => {
	// Vertical
	let pUp = 0;
	let mUp = row - 4 >= 0 ? row - 4 : 0;

	let pDown = 0;
	let mDown = row + 4 < board.tiles.length ? row + 4 : board.tiles.length - 1;

	console.log("Upper Max Row: ", mUp);
	console.log("Lower Max Row: ", mDown);

	// Upper Count
	console.log("Upper Count");
	for (let i = row - 1; i >= mUp; i--) {
		const wTile = board.tiles[i][col];
		console.log("Tile @ (", i, " ", col, ") =", wTile);

		if (wTile == player) {
			pUp++;
		} else {
			break;
		}
	}
	console.log("Pieces above: ", pUp);

	// Lower Count
	console.log("Lower Count");
	for (let i = row + 1; i <= mDown; i++) {
		const wTile = board.tiles[i][col];
		console.log("Tile @ (", i, " ", col, ") =", wTile);

		if (wTile == player) {
			pDown++;
		} else {
			break;
		}
	}
	console.log("Pieces below: ", pDown);
	console.log("Number of Vertical Pieces = ", pUp + pDown);
	return pUp + pDown >= 3;
};

board.checkL2RDiagonal = (player, row, col) => {
	// Diagonal L2R
	let pUL2R = 0;
	let pDL2R = 0;

	let mLeft = col - 4 > 0 ? col - 4 : 0;

	let mRight =
		col + 4 < board.tiles[0].length ? col + 4 : board.tiles[0].length - 1;

	// Left Up Count
	console.log("Up and Left Count");
	let i = row - 1;
	for (let j = col - 1; j >= mLeft; j--) {
		if (i < 0) {
			break;
		}

		const wTile = board.tiles[i][j];

		console.log("Tile @ (", i, " ", j, ") =", wTile);

		i--;

		if (wTile == player) {
			pUL2R++;
		} else {
			break;
		}
	}
	console.log("Pieces to the Up and Left: ", pUL2R);

	// Right Down Count
	console.log("Down and Right Count");
	i = row + 1;
	for (let j = col + 1; j <= mRight; j++) {
		if (i > board.tiles.length - 1) {
			break;
		}
		const wTile = board.tiles[i][j];
		console.log("Tile @ (", i, " ", j, ") =", wTile);

		i++;

		if (wTile == player) {
			pDL2R++;
		} else {
			break;
		}
	}
	console.log("Pieces to the Down and Right: ", pDL2R);

	console.log("Number of L2R Diagonal Pieces = ", pUL2R + pDL2R);

	return pUL2R + pDL2R >= 3;
};

board.checkR2LDiagonal = (player, row, col) => {
	// Diagonal L2R
	let pDR2L = 0;
	let pUR2L = 0;

	let mLeft = col - 4 > 0 ? col - 4 : 0;

	let mRight =
		col + 4 < board.tiles[0].length ? col + 4 : board.tiles[0].length - 1;

	// Right Up Count
	console.log("Up and Right Count");
	let i = row - 1;

	for (let j = col + 1; j <= mRight; j++) {
		if (i < 0) {
			break;
		}
		const wTile = board.tiles[i][j];
		console.log("Tile @ (", i, " ", j, ") =", wTile);

		i--;
		if (wTile == player) {
			pUR2L++;
		} else {
			break;
		}
	}
	console.log("Pieces to the Down and Right: ", pUR2L);

	// Left down Count
	console.log("Down and Left Count");
	i = row + 1;
	for (let j = col - 1; j >= mLeft; j--) {
		if (i > board.tiles.length - 1) {
			break;
		}

		const wTile = board.tiles[i][j];

		console.log("Tile @ (", i, " ", j, ") =", wTile);
		i++;

		if (wTile == player) {
			pDR2L++;
		} else {
			break;
		}
	}
	console.log("Pieces to the Up and Left: ", pDR2L);

	console.log("Number of L2R Diagonal Pieces = ", pDR2L + pUR2L);

	return pDR2L + pUR2L >= 3;
};

board.gameOver = (player) => {
	let title = document.querySelector("#title");
	let playerText = document.querySelector("#player");

	title.textContent = "Player " + player + " Has Won!!";
	title.style.color = "green";

	playerText.textContent = "Press any button to continue";
	playerText.style.color = "crimson";
};

board.dropPiece = (player, col) => {
	let title = document.querySelector("#title");
	let playerText = document.querySelector("#player");
	//check if the row is full
	if (board.tiles[0][col] != 0) {
		title.textContent = "Select a different colum";
		title.style.color = "crimson";
	} else {
		title.textContent = "Press a button to drop a token";
		title.style.color = "black";

		//drop the pice to the button of the col
		for (let row = board.rows - 1; row >= 0; row--) {
			if (board.tiles[row][col] == 0) {
				console.log(player);
				board.tiles[row][col] = player;
				board.turn++;
				board.checkWin(player, row, col);
				board.isTie();
				break;
			}
		}

		if (board.over) {
			board.gameOver(player);
		} else if (player == 2) {
			board.playerTurn = 1;
			playerText.textContent = "Player 1's playerTurn";
			playerText.style.color = colors.player1;
		} else if (player == 1) {
			board.playerTurn = 2;
			playerText.textContent = "Player 2's playerTurn";
			playerText.style.color = colors.player2;
		}
	}
};

//Buttons
let buttons = document.querySelectorAll("button");

function buttonOperation(bNum) {
	if (board.over) {
		board.reset();
	} else {
		console.log(
			"Button ",
			bNum + 1,
			" has been pressed by player ",
			board.playerTurn
		);
		board.dropPiece(board.playerTurn, bNum);
	}
}

let i = 0;
buttons.forEach((button) => {
	button.addEventListener("click", (e) => {
		buttonOperation(button.id);
	});
});

document.onkeypress = (e) => {
	let key = int(String.fromCharCode(e.which || e.keyCode));
	if (!isNaN(key) && key && key <= board.cols) {
		console.log(key);
		buttonOperation(key - 1);
	}
};
