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
  var elTimer = document.querySelector('.time');
  elTimer.innerText = '0.0';
  clearInterval(gIntervalID);
  renderRestartButton('😀');
  init();
  renderTable();
}

//show lives
function renderLives() {
  var elCell = document.querySelector('.lives');
  elCell.innerHTML = gLivesLeft;
}
