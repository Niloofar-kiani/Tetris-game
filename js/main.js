const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const nextCanvas = document.getElementById("next");
const nextCtx = nextCanvas.getContext("2d");

canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;
canvas.style.left = "50%";
canvas.style.top = "50%";
canvas.style.transform = "translate(-50%,-50%)";
canvas.style.position = "absolute";

nextCanvas.width = 6 * BLOCK_SIZE;
nextCanvas.height = 6 * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
nextCtx.scale(BLOCK_SIZE, BLOCK_SIZE);

let board = null;

let statValues = {
  score: 0,
  lines: 0,
  level: 0,
};

function updateStat(key, value) {
  const element = document.getElementById(key);
  if (element) {
    element.textContent = value;
  }
}

let stat = new Proxy(statValues, {
  set: (target, key, value) => {
    target[key] = value;
    updateStat(key, value);
    return true;
  },
});

function handleKeyEvent(event) {
  //to prevent default browsers behavoiur
  event.preventDefault();
  board.movePiece(event.keyCode);

  //prevent event bubbling
  return false;
}

function addEventListener() {
  document.removeEventListener("keydown", handleKeyEvent);
  document.addEventListener("keydown", handleKeyEvent);
}

function resetGame() {
  stat.lines = 0;
  stat.score = 0;
  stat.level = 0;
  board = new Board(ctx, nextCtx);
  time = {start: performance.now(), elapsed: 0, level: LEVEL[0]};
}

function play() {
  resetGame();
  addEventListener();

  if (requestId) {
    cancelAnimationFrame(requestId);
  }
  time.start = performance.now();
  animate();
}

function draw() {
  const {width, height} = canvas;
  ctx.clearRect(0, 0, width, height);
  board.draw();
}

let requestId = null;
let time;

function animate(now = 0) {
  time.elapsed = now - time.start;

  if (time.elapsed > time.level) {
    time.start = now;
    if (!board.drop()) {
      gameOver();
      return;
    }
  }
  draw();
  requestId = requestAnimationFrame(animate);
}

// for when close and then reopen the game's tab
// showHighScores();

function gameOver() {
  cancelAnimationFrame(requestId);
  ctx.fillStyle = "black";
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = "1px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("GAME OVER", 1.8, 4);

  checkHighScore(stat.score);
}

function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES));
  const lowestScore = highScores
    ? highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0
    : [];

  if (score > lowestScore) {
    saveHighScore(score, highScores);
    showHighScores();
  }
}

function saveHighScore(score, highScores) {
  const name = prompt("You get a high score! Please Enter Your Name: ");
  const newScore = {score, name};

  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);

  localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
}

function showHighScores() {
  const highScores = JSON.parse(localStorage?.getItem(HIGH_SCORES));
  const highScoresList = document.getElementById(HIGH_SCORES);
  console.log(highScoresList);
  highScoresList.innerHTML = highScores
    .map((score) => `<li>${score.score} - ${score.name}</li>`)
    .join("");
}

function pause() {
  if (requestId) {
    cancelAnimationFrame(requestId);
  }
}

function resume() {
  animate();
}

