// game is over
function gameOver() {
  gGame.isOn = false;
  renderRestartButton('😖');
  clearInterval(gIntervalID);
}

function gameWon() {
  gGame.isOn = false;
  console.log('GAME won!');
  renderRestartButton('😁');
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

//counting neighbors
function countNegs(cellI, cellJ) {
  var negsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j > gBoard[i].length - 1) continue;
      if (i === cellI && j === cellJ) continue;

      if (gBoard[i][j].isMine) {
        negsCount++;
      }
    }
  }
  return negsCount;
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
function getRandomMine(num, i, j) {
  var mines = 0;
  while (mines < num) {
    var celli = getRandomInt(0, gBoard.length);
    var cellj = getRandomInt(0, gBoard[0].length);
    if (celli === i && cellj === j) continue;

    gBoard[celli][cellj].isMine = true;
    mines++;
  }
}

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
