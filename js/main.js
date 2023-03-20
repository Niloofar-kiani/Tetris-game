const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const width = COLS * BLOCK_SIZE;
const height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let board = null;

function handleKeyEvent(event) {
  //to prevent default browsers behavoiur
  event.preventDefault();
 board.movePiece(event.keyCode);

  //prevent event bubbling
  return false;
}

function addEventListener() {
  document.removeEventListener('keydown' , handleKeyEvent)
  document.addEventListener('keydown' , handleKeyEvent)

}

function play() {
  board = new Board(ctx);
  addEventListener()
  if(requestId){
    cancelAnimationFrame(requestId)
  }
  time.start = performance.now();
  animate()
}

function draw() {
  const {width, height} = canvas;
  ctx.clearRect(0, 0, width, height);
  board.draw();
}

let requestId = null;
const time = {start: 0, elapsed: 0, level :1000};

function animate(now = 0) {
 time.elapsed = now - time.start;

 if(time.elapsed > time.level){
time.start = now;
if(!board.drop()){
gameOver();
return;
}

 }
 draw();
 requestId = requestAnimationFrame(animate)

}

function gameOver() {
  cancelAnimationFrame(requestId);
  ctx.fillStyle = "black";
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = "1px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("GAME OVER", 1.8, 4);
}