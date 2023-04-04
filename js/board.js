class Board {
  constructor(ctx, nextCtx){
    this.ctx = ctx;
    this.nextCtx = nextCtx;

    this.grid = this.getEmptyGrid();
    this.setNextTetromino();
    this.setCurrentTetromino();
  }

 getEmptyGrid() {
  return Array.from({length: ROWS}, () => Array(COLS).fill(0));
}
 draw() {
  //for having diffrent shapes
 this.grid.forEach((row, y) => {
    row.forEach ((value, x) => {
      if(value > 0){
        if (window.innerWidth < 900) {
          this.ctx.fillStyle = COLORSM[value -1];
        }else{
          this.ctx.fillStyle = COLORS[value -1];
        }
        //this.ctx.fillStyle = COLORS[value -1];
        this.ctx.fillRect(x, y, 1, 1);
        this.ctx.strokeRect(x, y, 1, 1);
      }
     })
    })
  this.tetromino.draw();
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
 moveTetromino(keyCode) {
  const moveFn = MOVES[keyCode];
  if(moveFn){
    let newPosition = moveFn(this.tetromino);
    //hard drop
    if(keyCode === KEYS.SPACE){
      while(this.isValid(newPosition)){
        this.tetromino.move(newPosition);
        stat.score += POINTS.HARD_DROP;
        newPosition = moveFn(this.tetromino);
        document.querySelector(".code").innerHTML = `<pre><code class="language-javascript">
if(keyCode === KEYS.SPACE){
  while(this.isValid(newPosition)){
  this.tetromino.move(newPosition);
  stat.score += POINTS.HARD_DROP;
  newPosition = moveFn(this.tetromino);
}
       </code></pre>`;
        Prism.highlightAll();
      
      }
    }
//soft drop
    if(this.isValid(newPosition)){
      this.tetromino.move(newPosition);
      if(keyCode === KEYS.DOWN) {
        stat.score += POINTS.SOFT_DROP;
      }
    }

    //redraw
    return true;
  }
 }

 //freeze the tetromino in it's final position
 freeze(){
   this.tetromino.shape.forEach((row, y) => {
     row.forEach ((value, x) => {
     if(value > 0){
      this.grid[y + this.tetromino.y][x + this.tetromino.x] = value;
      
     }
     })
    })

 }
 drop() {
  let newPosition = MOVES[KEYS.DOWN](this.tetromino);
  if(this.isValid(newPosition)){
    this.tetromino.move(newPosition)
  }else{
    this.freeze();
    this.clearLines();
    if(this.tetromino.y === 0){
      return false;
    }
    this.setCurrentTetromino();
  }
  return true;
 }



 clearLines() {
  this.clear = new Audio('../js/assets/sounds/clear.wav');
  let lines = 0;
  this.grid.forEach((row, y) =>{
    if(row.every((value)=> value > 0)){
      lines++;      
      //row.fill(1);
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

setNextTetromino() {
  const {width, height} = this.nextCtx.canvas;
  this.nextTetromino = new Tetromino(this.nextCtx);
  this.nextCtx.clearRect(0, 0, width, height);
  this.nextTetromino.draw();
} 

setCurrentTetromino() {
  this.tetromino = this.nextTetromino;
  this.tetromino.ctx = this.ctx;
  this.tetromino.x = 3;
  this.setNextTetromino();
}

getLineClearPoints(lines) {
  const lineClearPoints = LINE_TO_POINTS[lines] ?? 0;
  return (stat.level + 1) * lineClearPoints;
}
}