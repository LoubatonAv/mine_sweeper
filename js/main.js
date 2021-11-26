'use strict';

//Global vars
const BOMB = '💣';
const FLAG = '🚩';
var gBoard;
var gCount;
var gNegs;
var gStartTime;
var gLivesLeft;
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
};
var gIntervalID;
var gClickCounter;
var gLevel = {
  size: 4,
  mines: 2,
};

//Innitiate
function init() {
  gGame.isOn = true;
  gBoard = createTable(gLevel.size);
  gClickCounter = 0;
  gLivesLeft = 3;
  renderLives();
  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
  };
  renderTable();
}

//Create the table to the Model
function createTable(size) {
  var board = [];

  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      var cell = {
        minesAroundCount: 0,
        isMine: false,
        isMarked: false,
        isShown: false,
      };
      board[i][j] = cell;
    }
  }

  return board;
}

//Set the game difficulty
function setDifficulty(size, mines) {
  renderRestartButton('😀');
  clearInterval(gIntervalID);
  gLevel.size = size;
  gLevel.mines = mines;
  renderTable();

  init();
}

//Marking the mines
function cellFlagged(elCell, e, i, j) {
  e.preventDefault();

  if (!gGame.isOn) return;

  var cell = gBoard[i][j];

  if (cell.isShown) return;

  if (cell.isMarked === false) {
    cell.isMarked = true;
    elCell.innerText = FLAG;
  } else {
    cell.isMarked = false;
    elCell.innerText = '';
  }

  if (cell.isMarked && cell.isMine) {
    gGame.markedCount++;
    cell.isShown = true;
  }
}

//Click cells to reveal + placing mines for the first time
function cellClicked(elCell, i, j) {
  var cell = gBoard[i][j];
  if (!gGame.isOn) return;
  if (cell.isMarked) return;

  if (gClickCounter === 0) {
    getRandomMine(gLevel.mines, i, j);
    setMinesNegsCount(gBoard);
    startTimeInterval();
    gClickCounter++;
  }

  if (cell.isShown) return;
  cell.isShown = true;
  elCell.classList.add('shown');

  if (cell.isMine) {
    gLivesLeft--;
    var elLives = document.querySelector('.lives');
    elLives.innerHTML = gLivesLeft;
    elCell.innerText = BOMB;
    var elLives = document.querySelector('.msg');
    elLives.innerHTML = 'You stepped on a mine!';
    messageRender();
    if (gLivesLeft === 0) {
      gameOver();
    }
  } else {
    if (cell.minesAroundCount > 0) {
      elCell.innerText = cell.minesAroundCount;
    }
    if (cell.minesAroundCount === 0) {
      expandShown(gBoard, i, j);
    }
  }

  isWin();
}

//Checks if some cells are left unrevealed.
function isWin() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      var currCell = gBoard[i][j];
      if (!currCell.isShown) return;
    }
  }
  gameWon();
}

function gameWon() {
  gGame.isOn = false;
  console.log('GAME won!');
  renderRestartButton('😁');
  clearInterval(gIntervalID);
}

function messageRender() {
  setTimeout(function () {
    var elLives = document.querySelector('.msg');
    elLives.innerHTML = '';
  }, 1500);
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (board[i][j].isMine) continue;
      var negMinesCount = countMines(i, j, board);
      board[i][j].minesAroundCount = negMinesCount;
    }
  }
}

function revealAllMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      var currCell = gBoard[i][j];
      if (currCell.isMine) {
        //dom
        var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
        elCell.innerHTML = BOMB;
        elCell.classList.add('mined');
      }
    }
  }
}

function countMines(cellI, cellJ, board) {
  var negMinesCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= board.length) continue;

      if (board[i][j].isMine) negMinesCount++;
    }
  }
  return negMinesCount;
}

function expandShown(board, elCellI, elCellJ) {
  for (var i = elCellI - 1; i <= elCellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = elCellJ - 1; j <= elCellJ + 1; j++) {
      if (i === elCellI && j === elCellJ) continue;
      if (j < 0 || j >= board.length) continue;
      var neighborCell = board[i][j];
      if (neighborCell.isMarked) {
        break;
      }
      if (neighborCell.isShown) {
        neighborCell.isShown = true;
        break;
      }
      if (!neighborCell.isShown) {
        neighborCell.isShown = true;
      }
      var elCurrNeighborCell = document.querySelector(
        `[data-i="${i}"][data-j="${j}"]`
      );

      elCurrNeighborCell.classList.add('shown');
      cellClicked(elCurrNeighborCell, i, j);

      if (neighborCell.minesAroundCount === 0) {
        elCurrNeighborCell.innerHTML = '';
      } else {
        elCurrNeighborCell.innerHTML = neighborCell.minesAroundCount;
      }
    }
  }
}

//render the table updating the dom
function renderTable() {
  var strHTML = '';
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += `<tr>\n`;
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      var mineNumber;
      if (!cell.isShown || cell.minesAroundCount === 0) {
        mineNumber = '';
      }
      var className = cell.isShown ? 'shown' : 'hidden';
      var flagged = cell.isMarked ? 'marked' : '';
      strHTML += `\t<td data-i="${i}" data-j="${j}" class="cell ${className} ${flagged}" oncontextmenu="cellFlagged(this,event,${i},${j})" onclick="cellClicked(this, ${i}, ${j})" >${mineNumber}</td>\n`;
    }

    strHTML += `</tr>\n`;
  }

  var elSeats = document.querySelector('.board');
  elSeats.innerHTML = strHTML;
}
