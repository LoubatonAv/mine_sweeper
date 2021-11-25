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

function checkIfGameWon() {
  if (gGame.shownCount === 14 && gGame.markedCount === 2) {
    gameWon();
  }
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

// floodFill(i, j);
// function floodFill(i, j) {
//   var gNegs = 0;
//   for (var xOffset = -1; xOffset <= 1; xOffset++) {
//     for (var yOffset = -1; yOffset <= 1; yOffset++) {
//       var i = i + xOffset;
//       var j = j + yOffset;
//       console.log('i:', i);
//       console.log('j:', j);
//       if (i > -1 && i < gBoard.length && j > -1 && gBoard[0].length) {
//         var cell = gBoard[i][j];
//         if (!cell.isMine && !cell.isShown) {
//           var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
//           console.log('eCell:', elCell);
//           if (!cell.isShown) {
//             cell.isShown = true;
//             elCell.innerText = gNegs;
//             elCell.classList.add('shown');
//             gGame.shownCount++;
//           }
//         }
//       }
//     }
//   }
//   console.log('total:', gNegs);
// }

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
