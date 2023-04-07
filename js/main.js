const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const nextCanvas = document.getElementById("next");
const nextCtx = nextCanvas.getContext("2d");

canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

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
var intro = new Audio("../js/assets/sounds/Tetris_start.mp3");
var gameoverSound = new Audio("../js/assets/sounds/gameover.wav");
var clickSound = new Audio("../js/assets/sounds/click.wav");
intro.loop = true;

function onTetrisLoad() {
  showHighScores();
}

function playIntro() {
  if (!intro.paused) {
    intro.pause();
  } else {
    intro.play();
  }
}

function handleKeyEvent(event) {
  //to prevent default browsers behavoiur
  event.preventDefault();
  board.moveTetromino(event.keyCode);

  //prevent event bubbling
  return false;
}

function spaceKeyEvent(event) {
  event.preventDefault();
  board.moveTetromino(32);
  //prevent event bubbling
  return false;
}

function leftKeyEvent(event) {
  event.preventDefault();
  board.moveTetromino(37);
  //prevent event bubbling
  return false;
}

function upKeyEvent(event) {
  event.preventDefault();
  board.moveTetromino(38);
  //prevent event bubbling
  return false;
}

function rightKeyEvent(event) {
  event.preventDefault();
  board.moveTetromino(39);
  //prevent event bubbling
  return false;
}

function downKeyEvent(event) {
  event.preventDefault();
  board.moveTetromino(40);
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
  hidePlay();
  showBtn();
  resetGame();
  intro.play();
  addEventListener();
  clickSound.play();
  document.querySelector(
    ".code",
  ).innerHTML = `<pre><code class="language-javascript">
function play() {
  hidePlay();
  showBtn();
  resetGame();
  addEventListener();
  clickSound.play();
  if (requestId) {
    cancelAnimationFrame(requestId);
  }
  time.start = performance.now();
  animate();
  }</code></pre>`;
  Prism.highlightAll();

  if (requestId) {
    cancelAnimationFrame(requestId);
  }
  time.start = performance.now();
  animate();
}
const postUserName = async (user) => {
  const res = await fetch("http://127.0.0.1:3008/tetris/username", {
    method: "POST",
    body: JSON.stringify({username: user}),
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

const postUserScore = async (user, score) => {
  const res = await fetch("http://127.0.0.1:3008/tetris/score", {
    method: "POST",
    body: JSON.stringify({username: user, score: score}),
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

// const getUsers = async (user, score) => {
//   const res = await fetch(`http://127.0.0.1:3008/tetris/users?username=${user}&score=${score}`, {
//     method: "GET",
//     body: JSON.stringify({username: user, score: score}),
//     mode: "cors",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return res.json();
// };




function draw() {
  const {width, height} = canvas;
  ctx.clearRect(0, 0, width, height);
  board.draw();
}

let requestId = null;
let time;

function hidePlay() {
  document.querySelector(".play-button").classList.add("hideBtn");
}

function showPlay() {
  document.querySelector(".play-button").classList.remove("hideBtn");
}

function hideBtn() {
  document.querySelector(".pause-button").classList.remove("pbtn-vis");
  document.querySelector(".reset-button").classList.remove("rbtn-vis");
  document.querySelector(".hs").classList.add("hs-show");
  document.querySelector(".game-over").classList.add("hs-show");
}

function showBtn() {
  document.querySelector(".pause-button").classList.add("pbtn-vis");
  document.querySelector(".reset-button").classList.add("rbtn-vis");
  document.querySelector(".hs").classList.remove("hs-show");
  document.querySelector(".game-over").classList.remove("hs-show");
}

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
  checkHighScore(stat.score);
  showPlay();
  hideBtn();
  gameoverSound.play();
  document.querySelector(
    ".code",
  ).innerHTML = `<pre><code class="language-javascript">
function gameOver() {
  cancelAnimationFrame(requestId);
  checkHighScore(stat.score);
  showPlay();
  hideBtn();
  gameoverSound.play();
}</code></pre>`;
  Prism.highlightAll();
}

function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];
  const lowestScore = highScores
    ? highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0
    : [];
  if (score > lowestScore) {
    saveHighScore(score, highScores);
    showHighScores();
  }
}

function saveHighScore(score, highScores) {
  const maxLength = 10;
  const username = prompt("You get a high score! Please Enter Your Name: ");
  const newScore = {score, username};
  //postUserName(username);
  //debugger;
  postUserScore(username, score);

  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);

  localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
}

function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];
  const highScoresList = document.getElementById(HIGH_SCORES);
  console.log(highScoresList);
  highScoresList.innerHTML = highScores
    .map((score) => `<li>${score.score} - ${score.name}</li>`)
    .join("");
  //getUsers().then((res) => console.log(res));
}

function pause() {
  var el = document.querySelector(".pause-button");
  clickSound.play();
  if (el.textContent === "Pause") {
    el.textContent = "Resume";
    el.classList.add("resume-button");
    if (requestId) {
      cancelAnimationFrame(requestId);
    }
  } else {
    el.textContent = "Pause";
    el.classList.remove("resume-button");
    animate();
  }
  document.querySelector(
    ".code",
  ).innerHTML = `<pre><code class="language-javascript">
function pause() {
clickSound.play();
if(el.textContent === "Pause") {
  el.textContent = "Resume";
  el.classList.add("resume");
  if (requestId) {
    cancelAnimationFrame(requestId);
  }
}else {
  el.textContent = "Pause";
  el.classList.remove("resume");
  animate();
}
}</code></pre>`;
  Prism.highlightAll();
}
