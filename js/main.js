const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const nextCanvas = document.getElementById("next");
const nextCtx = nextCanvas.getContext("2d");

canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;
// canvas.style.left = "50%";
// canvas.style.top = "50%";
// canvas.style.transform = "translate(-50%,-50%)";
// canvas.style.position = "absolute";

nextCanvas.width = 6 * BLOCK_SIZE;
nextCanvas.height = 6 * BLOCK_SIZE;
// nextCanvas.style.left = "50%";
// nextCanvas.style.top = "50%";
// nextCanvas.style.transform = "translate(-50%,-50%)";

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
var intro = new Audio('../Tetris_start.mp3');
var gameoverSound = new Audio('../gameover.wav');
var clickSound = new Audio('../click.wav');

function onTetrisLoad(){
  showHighScores();
 
}

function playIntro(){
  if (!intro.paused) {
    intro.pause();
  }else{
    intro.play();
  }
}

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
  hidePlay();
  showPause();
  resetGame();
  addEventListener();
  intro.pause();
  clickSound.play();

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

function hidePlay(){
  document.querySelector(".play-button").classList.add("hideBtn");
}

function showPlay(){
  document.querySelector(".play-button").classList.remove("hideBtn");
}

function hidePause(){
  document.querySelector(".pause-button").classList.remove("pbtn-vis");
}

function showPause(){
  document.querySelector(".pause-button").classList.add("pbtn-vis");
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
  ctx.fillStyle = "#090037";
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = "1px Arial";
  ctx.fillStyle = "#ee203f";
  ctx.fillText("GAME OVER", 1.8, 4);
  checkHighScore(stat.score);
  showPlay();
  hidePause();
  gameoverSound.play();
}

function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];
  const lowestScore = highScores
    ? highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0
    : [];
  console.log(highScores)
  if (score > lowestScore) {
    saveHighScore(score, highScores);
    showHighScores();
  }
}

function saveHighScore(score, highScores) {
  const maxLength = 10;
  const name = prompt("You get a high score! Please Enter Your Name: ");
  const newScore = {score, name};

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
}

function pause() {
  var el=document.querySelector(".pause-button");
  clickSound.play();
  if(el.textContent === "Pause"){
      el.textContent = "Resume";
      el.classList.add("resume-button");
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
  }else{
    el.textContent = "Pause";
    el.classList.remove("resume-button");
    animate();
  }
}

//Get context and screen size;
// var ctx1 = cnv.getContext("2d");
// var W = window.innerWidth;
// var H = window.innerHeight;

// //Set Canvas and Background Color;
// cnv.width = W;
// cnv.height = H;
// ctx1.fillStyle = "#112";
// ctx1.fillRect(0, 0, W, H);

// //Glow effect;
// ctx1.shadowBlur = 10;
// ctx1.shadowColor = "white";

// function animate() {
//   //Random position and size of stars;
//   let x = W * Math.random();
//   let y = H * Math.random();
//   let r = 2.5 * Math.random();

//   //Draw the stars;
//   ctx1.beginPath();
//   ctx1.fillStyle = "white";
//   ctx1.arc(x, y, r, 0, Math.PI * 2);
//   ctx1.fill();

//   //Using setTimeout instead of window.requestAnimationFrame for slower speed... window.requestAnimationFrame is approximately equal to setTimeout(func, 17);
//   setTimeout(animate, 100);
// }
// animate();

