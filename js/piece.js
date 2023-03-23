class Piece{
  constructor(ctx){
    this.ctx = ctx;

    const typeId = this.randomizeTetrominos(COLORS.length);
    this.color = COLORS[typeId];
    this.shape = SHAPES[typeId];
    this.x = 3;
    this.y = 0;
  }
  draw() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }
  move(p) {
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
  }

  randomizeTetrominos(nbTypes){
    return Math.floor(Math.random()* nbTypes);
  }
}