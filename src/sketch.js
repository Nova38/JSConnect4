/**
 * @file Sketch.js
 * @author Thomas Atkins (Thomas.Atkins@ku.edu)
 * @brief A Javascript implication of Connect 4 made for EECS 368 at KU
 * @version 1.0
 * @date 4/10/2020
 *
 * @copyright Copyright (c) 2020
 *
 *
 *
 * Notes:
 * 		- The default connect four game is a 6 by 7 board with 2 players, the code bellow is configured for this set up. A goal
 * 			that I kept in mind was to try and make those variables and the game board that they create as dynamic as i could in
 * 			most places. Currently the code should work with changes to the number of rows or cols, to drop pice with more than
 * 			7 cols but less than 9 cols only keyboard keys function. To make it more dynamic I would need to just have the javascript
 * 			create the button elements on the fly. If I update this project in the future I will add the ability to change the number
 * 			of cols via a drop down.
 *
 */

//set up the game board
let board = {
	tiles: [],
	turn: 0,
	over: false,
	tie: false,
	playerTurn: 1,
	rows: 6,
	cols: 7,
	boxSize: 70,
	spacing: 105.0,
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

// First time run set up
function setup() {
	board.reset();

	colors = {
		dropRow: color(150),
		empty: color(255, 255, 255, 0),
		player1: color(255, 127, 80),
		player2: color(65, 105, 225),
		boarder: color(150),
		text: color(75),
	};
}

// A P5 function that facilitate redrawing the canvas
function draw() {
	board.drawGameBoard();
}

//Clear all stored state in-order to set up initial state or reset the board for a new game
board.reset = () => {
	//clear the turn

	//reset the board state
	Object.assign(board, {
		turn: 0,
		over: false,
		tie: false,
		playerTurn: 1,
	});

	// Recreate the canvas
	createCanvas(maxWidth, maxHight);
	board;
	// Regenerate the game board
	for (let row = 0; row < board.rows; row++) {
		board.tiles[row] = [];
		for (let col = 0; col < board.cols; col++) {
			board.tiles[row][col] = 0;
		}
	}

	// Reset the messages to the players
	let title = document.querySelector("#title");
	title.textContent = "Press a button or a number key to drop a token";
	title.style.color = "black";

	let playerText = document.querySelector("#player");
	playerText.textContent = "Player 1's Turn";
	playerText.style.color = colors.player1;
};

// Draw the outer boarder and the gird
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

// Function to check if a win condition has been met
// Only checks win conditions that could occur from the last dropped piece
board.checkWin = (player, row, col) => {
	console.log("Player #", player);
	console.log("Row: ", row);
	console.log("Column: ", col);

	// Check if a win condition has happened in any given direction
	let horizontal = board.checkHorizontal(player, row, col);
	let vertical = board.checkVertical(player, row, col);
	let L2RDiagonal = board.checkL2RDiagonal(player, row, col);
	let R2LDiagonal = board.checkR2LDiagonal(player, row, col);

	// If any of the directions is true then the a win condition has occurred
	if (vertical || horizontal || L2RDiagonal || R2LDiagonal) {
		board.over = true;
	}

	if (board.over) {
		console.log("Player ", player, " has won!");
		console.log("playerTurn: ", board.playerTurn);
	}
};

// Checks if the a tie has occurs
board.isTie = () => {
	if (board.turn >= board.rows * board.cols) {
		board.tie = true;
		board.over = true;
	}
};

// Checks if there is a win in the horizontal direction
board.checkHorizontal = (player, row, col) => {
	// Horizontal
	let pLeft = 0;
	let mLeft = col - 4 > 0 ? col - 4 : 0;

	let pRight = 0;
	let mRight = col + 4 < board.cols ? col + 4 : board.cols - 1;

	console.log("Left Max Col: ", mLeft);
	console.log("Right Max col: ", mRight);
	console.log("Col+1: ", col + 1);

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

	// If their are 3 + the starting piece in this direction then there are 4 in a row.
	return pLeft + pRight >= 3;
};

// Checks if there is a win in the Vertical direction
board.checkVertical = (player, row, col) => {
	// Vertical
	let pUp = 0;
	let mUp = row - 4 >= 0 ? row - 4 : 0;

	let pDown = 0;
	let mDown = row + 4 < board.rows ? row + 4 : board.rows - 1;

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

	// If their are 3 + the starting piece in this direction then there are 4 in a row.
	return pUp + pDown >= 3;
};

// Checks if there is a win in the diagonal starting in the top left to bottom right direction
board.checkL2RDiagonal = (player, row, col) => {
	// Diagonal L2R
	let pUL2R = 0;
	let pDL2R = 0;

	let mLeft = col - 4 > 0 ? col - 4 : 0;

	let mRight = col + 4 < board.cols ? col + 4 : board.cols - 1;

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

	// If their are 3 + the starting piece in this direction then there are 4 in a row.
	return pUL2R + pDL2R >= 3;
};

// Checks if there is a win in the diagonal starting in the top right to bottom left direction
board.checkR2LDiagonal = (player, row, col) => {
	// Diagonal L2R
	let pDR2L = 0;
	let pUR2L = 0;

	let mLeft = col - 4 > 0 ? col - 4 : 0;

	let mRight = col + 4 < board.cols ? col + 4 : board.cols - 1;

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

	// If their are 3 + the starting piece in this direction then there are 4 in a row.
	return pDR2L + pUR2L >= 3;
};

// Set the game over message and announce the winner
board.gameOver = (player) => {
	let title = document.querySelector("#title");
	let playerText = document.querySelector("#player");

	// Instruct user how to continue
	playerText.textContent = "Press any button to continue";
	playerText.style.color = "crimson";

	//Checks if their is a winner
	if (board.tie) {
		title.textContent = "A Tie Has Occurred";
		title.style.color = "blue";
	} else {
		title.textContent = "Player " + player + " Has Won!!";
		title.style.color = "green";
	}
};

// This is the turn function
// It handles the updating of the state of the board and
// The checking of win conditions
board.dropPiece = (player, col) => {
	let title = document.querySelector("#title");
	let playerText = document.querySelector("#player");
	//check if the row is full
	if (board.tiles[0][col] != 0) {
		title.textContent = "Select a different colum";
		title.style.color = "crimson";
	} else {
		title.textContent = "Press a button or a number key to drop a token";
		title.style.color = "black";

		//drop the pice to the bottom of the col
		for (let row = board.rows - 1; row >= 0; row--) {
			if (board.tiles[row][col] == 0) {
				console.log(player);
				board.tiles[row][col] = player;
				board.turn++;

				//check for game over conditions
				board.checkWin(int(player), int(row), int(col));
				board.isTie();
				break;
			}
		}

		// Prepare for the end or the next turn
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

// This section handles the input from the users

// Get an array of all the Buttons
let buttons = document.querySelectorAll("button");

// Function to be called by the either keypress or button
function buttonOperation(bNum) {
	// Input resets the game if the game is over
	if (board.over) {
		board.reset();
	} else {
		// Take the button that has been called and drop a piece of the current player in the selected col
		console.log(
			"Button ",
			bNum + 1,
			" has been pressed by player ",
			board.playerTurn
		);
		board.dropPiece(board.playerTurn, bNum);
	}
}

// for all buttons set the callback function
let i = 0;
buttons.forEach((button) => {
	button.addEventListener("click", (e) => {
		buttonOperation(button.id);
	});
});

// Enable secondary input via keyboard numeric inputs
document.onkeypress = (e) => {
	let key = int(String.fromCharCode(e.which || e.keyCode));
	if (!isNaN(key) && key && key <= board.cols) {
		console.log(key);
		buttonOperation(key - 1);
	}
};
