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
  //for having diffrent shapes
 this.grid.forEach((row, y) => {
    row.forEach ((value, x) => {
     if(value > 0){
      this.ctx.fillStyle = COLORS[value -1];
      this.ctx.fillRect(x, y, 1, 1);
     }
     })
    })
  this.piece.draw();
 }

 isInsideWalls(x, y) {
  return x >= 0 && x < COLS && y < ROWS;
 }

 isNotOccupied(x,y) {
  return this.grid[y] && this.grid[y][x] === 0;
 }

 isValid(p) {
  return p.shape.every ((row, dy) => {
 return row.every ((value, dx) => {
  const x = p.x + dx;
  const y = p.y + dy;
  return value === 0 || (this.isInsideWalls(x, y) && this.isNotOccupied(x, y))
  })
 })
 }
 movePiece(keyCode) {
  const moveFn = MOVES[keyCode];
  if(moveFn){
    let newPosition = moveFn(this.piece);

    if(keyCode === KEYS.SPACE){
      while(this.isValid(newPosition)){
        this.piece.move(newPosition);
        newPosition = moveFn(this.piece);
      }
    }

    if(this.isValid(newPosition)){
      this.piece.move(newPosition);
    }

    //redraw
    return true;
  }
 }

 //freeze the piece in its final position
 freeze(){
   this.piece.shape.forEach((row, y) => {
     row.forEach ((value, x) => {
     if(value > 0){
      this.grid[y + this.piece.y][x + this.piece.x] = value;
     }
     })
    })
 }
 drop() {
  let newPosition = MOVES[KEYS.DOWN](this.piece);
  if(this.isValid(newPosition)){
    this.piece.move(newPosition)
  }else{
    this.freeze();
    this.clearLines();
    if(this.piece.y === 0){
      return false;
    }
    this.piece = new Piece(this.ctx);
  }
  return true;
 }

 clearLines() {
  this.grid.forEach((row, y) =>{
    if(row.every((value)=> value > 0)){
      this.grid.splice(y, 1);
      this.grid.unshift( Array(COLS).fill(0))
    }
  });
 }
}