class Board {
  constructor(ctx){
    this.ctx = ctx;

    this.grid = this.getEmptyGrid();
    this.piece = new Piece(ctx);
  }
 getEmptyGrid() {
  return Array.from({length: ROWS}, () => Array(COLS).fill(0));
 }
 draw() {
  this.piece.draw();
 }

 isInsideWalls(x, y) {
  return x >= 0 && x < COLS && y < ROWS;
 }

 isValid(p) {
  return p.shape.every ((row, dy) => {
 return row.every ((value, dx) => {
  return value === 0 || this.isInsideWalls(p.x + dx , p.y + dy)
  })
 })
 }
 movePiece(keyCode) {
  const moveFn = MOVES[keyCode];
  if(moveFn){
    const newPosition = moveFn(this.piece);

    if(this.isValid(newPosition)){
      this.piece.move(newPosition);
    }

    //redraw
    return true;
  }
 }
}