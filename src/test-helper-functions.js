// Check for valid number
export function isValidNumber(num) {
    if (!Number.isInteger(num) || num <= 0 || num > 9) {
        return false;
    } else {
        return true;
    }
}

// Convert input elements to 2D array of values
export function getSudokuGrid(gridInputs) {
    let grid = new Array(9);
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(9);
    }

    gridInputs.forEach((input) => {
        grid[Math.floor(input.id / 9)][input.id % 9] = input.value
            ? parseInt(input.value)
            : 0;
    });
    return grid;
}

// Find next empty square on sudoku board
export function nextEmptySpot(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] === 0) return [i, j];
        }
    }
    return [-1, -1];
}

// Check that value is not in row
export function checkRow(board, row, value) {
    for (var i = 0; i < board[row].length; i++) {
        if (board[row][i] === value) {
            return false;
        }
    }

    return true;
}

// Check that value is not in column
export function checkColumn(board, column, value) {
    for (var i = 0; i < board.length; i++) {
        if (board[i][column] === value) {
            return false;
        }
    }

    return true;
}

// Check that value is not in square
export function checkSquare(board, row, column, value) {
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(column / 3) * 3;

    for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 3; c++) {
            if (board[boxRow + r][boxCol + c] === value) return false;
        }
    }

    return true;
}

// Run check functions on value
export function checkValue(board, row, column, value) {
    if (
        checkRow(board, row, value) &&
        checkColumn(board, column, value) &&
        checkSquare(board, row, column, value)
    ) {
        return true;
    }

    return false;
}

// Solve sudoku board
export function solve(board) {
    let emptySpot = nextEmptySpot(board);
    let row = emptySpot[0];
    let col = emptySpot[1];

    // there are no more empty spots
    if (row === -1) {
        return board;
    }

    for (let num = 1; num <= 9; num++) {
        if (checkValue(board, row, col, num)) {
            board[row][col] = num;
            solve(board);
        }
    }

    if (nextEmptySpot(board)[0] !== -1) board[row][col] = 0;
    return board;
}
