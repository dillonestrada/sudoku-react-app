import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    nextEmptySpot,
    solve,
    isValidNumber,
    getSudokuGrid,
} from "./test-helper-functions";
import App from "./App";

jest.spyOn(window, "alert").mockImplementation(() => {});

test("app has 9x9 grid", () => {
    render(<App />);
    const gridInputs = screen.getAllByRole("textbox");
    getSudokuGrid(gridInputs);
    expect(gridInputs.length).toBe(81);
});

test("user can enter a correct value into grid", () => {
    render(<App />);

    // Get values from DOM input elements and put them into 2D array
    const gridInputs = screen.getAllByRole("textbox");
    const grid = getSudokuGrid(gridInputs);

    // Find next empty spot & indices
    const emptySpotIndices = nextEmptySpot(grid);
    const emptySpot = gridInputs[emptySpotIndices[1]];

    // Get correct grid values
    const solvedGrid = solve(grid);
    const emptySpotCorrectValue =
        solvedGrid[emptySpotIndices[0]][emptySpotIndices[1]].toString();

    // Enter a correct value
    userEvent.type(emptySpot, emptySpotCorrectValue);

    expect(emptySpot).toHaveValue(emptySpotCorrectValue);
});

test("user can not enter a letter into a square", () => {
    render(<App />);

    // Get values from DOM input elements and put them into 2D array
    const gridInputs = screen.getAllByRole("textbox");
    const grid = getSudokuGrid(gridInputs);

    // Find next empty spot & indices
    const emptySpotIndices = nextEmptySpot(grid);
    const emptySpot = gridInputs[emptySpotIndices[1]];

    // Enter a letter
    userEvent.type(emptySpot, "a");

    expect(window.alert).toBeCalledWith("invalid move");
});

test("user can not enter a special character into a square", () => {
    render(<App />);

    // Get values from DOM input elements and put them into 2D array
    const gridInputs = screen.getAllByRole("textbox");
    const grid = getSudokuGrid(gridInputs);

    // Find next empty spot & indices
    const emptySpotIndices = nextEmptySpot(grid);
    const emptySpot = gridInputs[emptySpotIndices[1]];

    // Enter a special character
    userEvent.type(emptySpot, "/");

    expect(window.alert).toBeCalledWith("invalid move");
});

test("user can not enter a 0 into a square", () => {
    render(<App />);

    // Get values from DOM input elements and put them into 2D array
    const gridInputs = screen.getAllByRole("textbox");
    const grid = getSudokuGrid(gridInputs);

    // Find next empty spot & indices
    const emptySpotIndices = nextEmptySpot(grid);
    const emptySpot = gridInputs[emptySpotIndices[1]];

    // Enter "0"
    userEvent.type(emptySpot, "0");

    expect(window.alert).toBeCalledWith("invalid move");
});

test("user can not enter an incorrect value into a square", () => {
    render(<App />);

    // Get values from DOM input elements and put them into 2D array
    const gridInputs = screen.getAllByRole("textbox");
    const grid = getSudokuGrid(gridInputs);

    // Find next empty spot & indices
    const emptySpotIndices = nextEmptySpot(grid);
    const emptySpot = gridInputs[emptySpotIndices[1]];

    // Get correct grid values
    const solvedGrid = solve(grid);
    const emptySpotCorrectValue =
        solvedGrid[emptySpotIndices[0]][emptySpotIndices[1]].toString();

    // Enter an incorrect value
    userEvent.type(emptySpot, 10 - emptySpotCorrectValue);

    expect(window.alert).toBeCalledWith("invalid move");
});

test("user can not enter a duplicate row value into a square", () => {
    render(<App />);

    // Get values from DOM input elements and put them into 2D array
    const gridInputs = screen.getAllByRole("textbox");
    const grid = getSudokuGrid(gridInputs);
    const firstRowValueIndex = grid[0].findIndex(isValidNumber);

    // Find next empty spot & indices
    const emptySpotIndices = nextEmptySpot(grid);
    const emptySpot = gridInputs[emptySpotIndices[1]];

    // Enter a duplicate row value
    userEvent.type(emptySpot, grid[0][firstRowValueIndex]);

    expect(window.alert).toBeCalledWith("invalid move");
});

test("user can not enter a duplicate column value into a square", () => {
    render(<App />);

    // Get values from DOM input elements and put them into 2D array
    const gridInputs = screen.getAllByRole("textbox");
    const grid = getSudokuGrid(gridInputs);
    const columnArr = [];

    for (let i = 0; i < 9; i++) {
        columnArr.push(grid[i][0]);
    }

    const firstColValueIndex = columnArr.findIndex(isValidNumber);
    const firstColEmptyIndex = columnArr.findIndex((num) => num === 0);
    const gridInputsIndex = firstColEmptyIndex * 9;

    // Enter a duplicate column value
    userEvent.type(gridInputs[gridInputsIndex], grid[firstColValueIndex][0]);

    expect(window.alert).toBeCalledWith("invalid move");
});

test("user can not enter a duplicate subgrid value into a square", () => {
    render(<App />);

    // Get values from DOM input elements and put them into 2D array
    const gridInputs = screen.getAllByRole("textbox");
    const grid = getSudokuGrid(gridInputs);
    const subgridArr = [];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            subgridArr.push(grid[i][j]);
        }
    }

    // Get indices of first value in a column and first empty column
    const firstColValueIndex = subgridArr.findIndex(isValidNumber);
    const firstColValueIndices = [
        Math.floor(firstColValueIndex / 3),
        firstColValueIndex % 3,
    ];
    const firstColEmptyIndex = subgridArr.findIndex((num) => num === 0);

    // Get the index of empty input element
    const gridInputsIndex =
        Math.floor(firstColEmptyIndex / 3) * 9 + (firstColEmptyIndex % 3);

    // Enter a duplicate subgrid value
    userEvent.type(
        gridInputs[gridInputsIndex],
        grid[firstColValueIndices[0]][firstColValueIndices[1]]
    );

    expect(window.alert).toBeCalledWith("invalid move");
});

test("clicking 'New Game' button generates a new sudoku board", () => {
    render(<App />);

    // Get values from DOM input elements and put them into 2D array
    const initialGridInputs = screen.getAllByRole("textbox");
    const initialGrid = getSudokuGrid(initialGridInputs);

    // Find button element
    const button = screen.getByRole("button");
    userEvent.click(button);

    // Get values from DOM input elements after click and put them into 2D array
    const afterClickGridInputs = screen.getAllByRole("textbox");
    const afterClickGrid = getSudokuGrid(afterClickGridInputs);

    expect(JSON.stringify(initialGrid) === JSON.stringify(afterClickGrid)).toBe(
        false
    );
});

// test("finishing board correctly alerts 'Completed!'", () => {
//     render(<App />);

//     // Get values from DOM input elements and put them into 2D array
//     const gridInputs = screen.getAllByRole("textbox");
//     const grid = getSudokuGrid(gridInputs);

//     // Get correct grid values
//     const solvedGrid = solve(grid);

//     let counter = 0;

//     const gameBoard = document.querySelector(".gameBoard");

//     for (let i = 0; i < 9; i++) {
//         for (let j = 0; j < 9; j++) {
//             if (gridInputs[counter].value != solvedGrid[i][j]) {
//                 userEvent.type(gridInputs[counter], solvedGrid[i][j]);
//             }

//             // gridInputs[counter].value == solvedGrid[i][j]
//             //     ? ""
//             //     : (gridInputs[counter].value = parseInt(solvedGrid[i][j]));
//             counter++;
//         }
//     }

//     const afterGridInputs = screen.getAllByRole("textbox");
//     const afterGrid = getSudokuGrid(afterGridInputs);

//     expect(window.alert).toBeCalledWith("Completed!");
// });
