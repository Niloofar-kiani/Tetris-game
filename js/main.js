const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const width = COLS * BLOCK_SIZE;
const height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let board = null;

function handleKeyEvent(event) {
  //to prevent default browsers behavoiur
  event.preventDefault();

  const redraw = board.movePiece(event.keyCode);
  if(redraw){
    draw();
  }
  //prevent event bubbling
  return false;
}

function addEventListener() {
  document.removeEventListener('keydown' , handleKeyEvent)
  document.addEventListener('keydown' , handleKeyEvent)

}

function play() {
  board = new Board(ctx);
  draw()
  addEventListener()
}

function draw() {
  const {width, height} = canvas;
  ctx.clearRect(0, 0, width, height);
  board.draw();
}