class Board {
  constructor(ctx, nextCtx){
    this.ctx = ctx;
    this.nextCtx = nextCtx;

    this.grid = this.getEmptyGrid();
    this.setNextPiece();
    this.setCurrentPiece();
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
        this.ctx.strokeRect(x, y, 1, 1);
        this.ctx.fillStyle = 'white';
        this.ctx.font = "0.5px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(value, x + 0.5, y + 0.5);
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
//hard drop
    if(keyCode === KEYS.SPACE){
      while(this.isValid(newPosition)){
        this.piece.move(newPosition);
        stat.score += POINTS.HARD_DROP;
        newPosition = moveFn(this.piece);
      }
    }
//soft drop
    if(this.isValid(newPosition)){
      this.piece.move(newPosition);
      if(keyCode === KEYS.DOWN) {
        stat.score += POINTS.SOFT_DROP;
      }
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
    this.setCurrentPiece();
  }
  return true;
 }



 clearLines() {
  this.clear = new Audio('../../assets/sounds/clear.wav');
  let lines = 0;
  this.grid.forEach((row, y) =>{
    if(row.every((value)=> value > 0)){
      lines++;      
      row.fill(8);
      setTimeout(() => { 
        this.grid.splice(y, 1);
        this.grid.unshift(Array(COLS).fill(0));
        this.clear.play();
      }, 1500);
    }
  });
  if(lines > 0) {
    stat.score += this.getLineClearPoints(lines);
    stat.lines += lines;

    if(stat.lines >= LINES_PER_LEVEL){
      stat.level++;
      stat.lines -= LINES_PER_LEVEL;
      time.level = LEVEL[stat.level];
    }
  }
 }

setNextPiece() {
  const {width, height} = this.nextCtx.canvas;
  this.nextPiece = new Piece(this.nextCtx);
  this.nextCtx.clearRect(0, 0, width, height);
  this.nextPiece.draw();
} 

setCurrentPiece() {
  this.piece = this.nextPiece;
  this.piece.ctx = this.ctx;
  this.piece.x = 3;
  this.setNextPiece();
}

getLineClearPoints(lines) {
  const lineClearPoints = LINE_TO_POINTS[lines] ?? 0;
  return (stat.level + 1) * lineClearPoints;
}
}