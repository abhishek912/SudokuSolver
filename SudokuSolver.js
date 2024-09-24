var sudoku = [];
var initialSudoku = [];
var totalRandomNumberCount = 26;
var delayTime = 100;
var alreadyFilledCellsCount = 22;
var totalNoOfOperations = 0;
var totalTimeTaken = 0;
var startTime;
var endTime;
var isSolving = false;
var isSolved = false;

window.onload = function () {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const content = document.getElementById("content-container");
    // Show the spinner for 20 seconds
    setTimeout(() => {
        loadingSpinner.classList.add('hidden');
        content.style.display = 'block'; // Show the content
    }, 2000); // 20 seconds delay
};

document.addEventListener("DOMContentLoaded", function() {
    generateSudoku();
});

function stopSolving() {
    if(isSolving) {
        isSolving = false;
        let stopBtn = document.getElementById('stopSolving');
        stopBtn.style.backgroundColor = 'gray';
        
        let generateSudokuBtn = document.getElementById('generateSudoku');
        let solveSudokuBtn = document.getElementById('solveSudoku');

        generateSudokuBtn.disabled = false;
        generateSudokuBtn.style.backgroundColor = '#007bff';
        solveSudokuBtn.disabled = false;
        solveSudokuBtn.style.backgroundColor = '#007bff';

        let endTimeLabel = document.getElementById('endTime');
        endTime = new Date();
        endTimeLabel.innerText = formatTime(endTime);

        let totalTimeTakenDiv = document.getElementById('totalTimeTaken');
        totalTimeTakenDiv.innerText = findTimeDifference();

        let totalMovesDiv = document.getElementById('totalMoves');
        totalMovesDiv.innerText = totalNoOfOperations;
    }
}

function formatTime(date) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12'; // the hour '0' should be '12'
    
    return `${hours}:${minutes}:${seconds} ${ampm}`;
}

async function solveSudoku() {
    isSolved = false;
    sudoku = JSON.parse(JSON.stringify(initialSudoku));
    generateSudoku(false);
    totalNoOfOperations = 0;
    console.log("solving sudoku");
    isSolving = true;
    let generateSudokuBtn = document.getElementById('generateSudoku');
    let solveSudokuBtn = document.getElementById('solveSudoku');
    let stopBtn = document.getElementById('stopSolving');

    generateSudokuBtn.disabled = true;
    generateSudokuBtn.style.backgroundColor = 'gray';

    solveSudokuBtn.disabled = true;
    solveSudokuBtn.style.backgroundColor = 'gray';

    stopBtn.disabled = false;
    stopBtn.style.backgroundColor = 'red';

    let startTimeLabel = document.getElementById('startTime');
    startTime = new Date();
    startTimeLabel.innerText = formatTime(startTime);

    const solved = await solveSudokuImpl(); // Await the result of the async function
    if (solved) {
        isSolved = true;
        generateSudokuBtn.disabled = false;
        generateSudokuBtn.style.backgroundColor = '#007bff';
        stopBtn.disabled = true;
        stopBtn.style.backgroundColor = 'gray';

        let endTimeLabel = document.getElementById('endTime');
        endTime = new Date();
        endTimeLabel.innerText = formatTime(endTime);

        let totalTimeTakenDiv = document.getElementById('totalTimeTaken');
        totalTimeTakenDiv.innerText = findTimeDifference();

        let totalMovesDiv = document.getElementById('totalMoves');
        totalMovesDiv.innerText = totalNoOfOperations;
        console.log("sudoku solved******************");
    } else {
        //sudoku = JSON.parse(JSON.stringify(initialSudoku));
        // generateSudoku(false);
        console.log("no solution exists");
    }
}

function findTimeDifference() {
    const differenceInMilliseconds = endTime - startTime;

    const seconds = Math.floor((differenceInMilliseconds / 1000) % 60);
    const minutes = Math.floor((differenceInMilliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((differenceInMilliseconds / (1000 * 60 * 60)) % 24);

    return `${hours}:${minutes}:${seconds}`;
}


async function solveSudokuImpl() {
    let emptyPos = findEmptyPosition();
    totalNoOfOperations++;

    let endTimeLabel = document.getElementById('endTime');
    endTime = new Date();
    endTimeLabel.innerText = formatTime(endTime);

    let totalTimeTakenDiv = document.getElementById('totalTimeTaken');
    totalTimeTakenDiv.innerText = findTimeDifference();

    let totalMovesDiv = document.getElementById('totalMoves');
    totalMovesDiv.innerText = totalNoOfOperations;

    if (!emptyPos) {
        return true;
    }
    if(!isSolving) return false;

    let row = emptyPos[0];
    let col = emptyPos[1];

    for (let num = 1; num <= 9 && isSolving; num++) {
        if (isSafe(row, col, num)) {
            sudoku[row][col] = num;
            let tblCell = document.getElementById(`cell-${row}-${col}`);
            tblCell.innerText = `${sudoku[row][col]}`;
            tblCell.style.backgroundColor = '#7990f7';
            await delay(delayTime);

            if (await solveSudokuImpl()) {
                return true;
            }
            if(isSolving) {
                let endTimeLabel = document.getElementById('endTime');
                endTime = new Date();
                endTimeLabel.innerText = formatTime(endTime);

                let totalTimeTakenDiv = document.getElementById('totalTimeTaken');
                totalTimeTakenDiv.innerText = findTimeDifference();

                totalNoOfOperations++;
                let totalMovesDiv = document.getElementById('totalMoves');
                totalMovesDiv.innerText = totalNoOfOperations;
                tblCell.style.backgroundColor = '#f67861';
                await delay(delayTime);
                tblCell.style.backgroundColor = '';
                tblCell.innerText = ''; 
                sudoku[row][col] = 0;
                await delay(delayTime); 
            }
        }
    }

    return false;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function findEmptyPosition() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudoku[row][col] === 0) {
                return [row, col];
            }
        }
    }
    return null;
}

function generateSudoku(getDefault = true) {
    if(getDefault) {
        getDefault && generateSolveableSudoku();
        initialSudoku = JSON.parse(JSON.stringify(sudoku)); 
    }

    let table = document.getElementById('sudoku')
    if(table) table.remove();

    table = document.createElement('table');
    table.id = 'sudoku';
    table.className = 'sudoku-table'; // Add a class for styling
    table.style.borderCollapse = 'collapse'; 
    for(let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        row.id = `row-${i}`;
        for(let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            cell.id = `cell-${i}-${j}`;
            cell.className = 'sudoku-cell';
            if(sudoku[i][j] > 0) {
                cell.innerText = sudoku[i][j];
                cell.style.backgroundColor = '#bfbcbb';
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    let sudokuDiv = document.getElementById("sudokuDiv");
    sudokuDiv.appendChild(table);
}

function generateFullSudoku() {
    sudoku = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillSudoku(sudoku);
}

function fillSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                let nums = Array.from({ length: 9 }, (_, i) => i + 1);
                shuffleArray(nums); // Randomize the order of numbers
                for (let num of nums) {
                    if (isSafe(row, col, num)) {
                        board[row][col] = num;
                        if (fillSudoku(board)) {
                            return true;
                        }
                        board[row][col] = 0; // Backtrack
                    }
                }
                return false; // No valid number found
            }
        }
    }
    return true; // Sudoku board is completely filled
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generatePuzzle(filledCellsCount) {
    const totalCells = 81; // Total cells in a Sudoku grid
    let cellsToRemove = totalCells - filledCellsCount;
    while (cellsToRemove > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (sudoku[row][col] !== 0) {
            sudoku[row][col] = 0; // Remove the number
            cellsToRemove--;
        }
    }
}

function generateSolveableSudoku() {
    generateFullSudoku();
    generatePuzzle(alreadyFilledCellsCount);
}

function isSafe(i, j, digit) {
    for(let col = 0; col <9; col++) {
        if(sudoku[i][col] == digit) {
            return false;
        }
    }

    for(let row = 0; row<9; row++) {
        if(sudoku[row][j] == digit) {
            return false;
        }
    }

    let startRow = i - (i % 3);
    let startCol = j - (j % 3);
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (sudoku[row + startRow][col + startCol] === digit) {
                return false;
            }
        }
    }

    return true;
}