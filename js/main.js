'use strict';

//To work on :
//Adjacent- expandShown - function in pdf file
//win - when all mines are flagged and all other cells are shown

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
  gLivesLeft = 1;

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

//flagging
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
    console.log('gGame.markedCount:', gGame.markedCount);
  }
}

//Click cells to reveal + placing mines for the first time
function cellClicked(elCell, i, j) {
  if (!gGame.isOn) return;
  if (gClickCounter === 0) {
    getRandomMine(gLevel.mines, i, j);
    startTimeInterval();
    gClickCounter++;
  }
  var cell = gBoard[i][j];

  if (cell.isShown) return;
  if (!cell.isShown) {
    cell.isShown = true;
    elCell.classList.add('shown');
    gGame.shownCount++;
    console.log('gGame.ShownCount:', gGame.shownCount);
  }
  if (cell.isMine === true) {
    gLivesLeft--;
    var elLives = document.querySelector('.lives');
    elLives.innerHTML = gLivesLeft;
    elCell.innerText = BOMB;
    if (gLivesLeft === 0) {
      gameOver();
    }
  } else {
    var gNegs = countNegs(i, j);
    elCell.innerText = gNegs;
    cell.minesAroundCount = gNegs;
    console.log('cell:', cell);
    checkIfGameWon();
  }
}

//after i get the neigh to work
// function checkShown() {
//   var counter = 0;
//   for (var i = 0; i < gBoard.length; i++) {
//     for (var j = 0; i < gBoard.length; j++) {
//       var cell = gBoard[i][j];
//       if (cell.isShown) counter++;
//     }
//   }
//   console.log('counter:', counter);
// }

function checkIfGameWon() {
  if (
    gGame.shownCount === gLevel.size ** 2 - gLevel.mines &&
    gGame.markedCount === gLevel.mines
  ) {
    gameWon();
  }
}
