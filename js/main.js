'use strict';

//To work on :
//Unflag
//MODAL
//Adjacent- expandShown - function in pdf file
//lives
//win - when all flags are flagged and all other cells are shown

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
        minesAroundCount: 4,
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

    if (gNegs === 0) {
      expandShown(elCell, gBoard, i, j);
    }

    checkIfGameWon();
  }
}

function expandShown(elCell, board, rowIdx, colIdx) {}

//render the table updating the dom
function renderTable() {
  var strHTML = '';
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += `<tr>\n`;
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];

      var className = cell.isShown ? 'shown' : 'hidden';
      var flagged = cell.isMarked ? 'marked' : '';
      strHTML += `\t<td data-i="${i}" data-j="${j}" class="cell ${className} ${flagged}" oncontextmenu="cellFlagged(this,event,${i},${j})" onclick="cellClicked(this, ${i}, ${j}) " ></td>\n`;
    }

    strHTML += `</tr>\n`;
  }

  var elSeats = document.querySelector('.board');
  elSeats.innerHTML = strHTML;
}
