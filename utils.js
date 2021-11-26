// game is over
function gameOver() {
  gGame.isOn = false;
  renderRestartButton('😖');
  revealAllMines();
  clearInterval(gIntervalID);
}

//timer
function startTimeInterval() {
  gStartTime = Date.now();
  gIntervalID = setInterval(function () {
    var elTimer = document.querySelector('.time');
    var miliSecs = Date.now() - gStartTime;
    elTimer.innerText = (miliSecs / 1000).toFixed(1);
  }, 10);
}

//random number
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function renderRestartButton(value) {
  var elLife = document.querySelector('.restart');
  elLife.innerText = value;
}

function restartGame() {
  renderRestartButton('😀');
  init();
  renderTable();
}

function renderLives() {
  var elCell = document.querySelector('.lives');
  elCell.innerHTML = gLivesLeft;
}

//creating the mines
function getRandomMine(numberOfMines, currI, currJ) {
  var mineCount = 0;
  var mines = [];
  var mineFound = false;
  while (mineCount < numberOfMines) {
    mineFound = false;
    var cellI = getRandomInt(0, gBoard.length);
    var cellJ = getRandomInt(0, gBoard[0].length);
    if (cellI === currI && cellJ === currJ) continue;
    for (var i = 0; i < mines.length; i++) {
      var mine = mines[i];
      if (mine.i === cellI && mine.j === cellJ) {
        mineFound = true;
        break;
      }
    }
    if (mineFound) continue;
    mines.push({ i: cellI, j: cellJ });
    gBoard[cellI][cellJ].isMine = true;
    mineCount++;
  }
}
