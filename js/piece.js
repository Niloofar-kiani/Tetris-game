class Piece{
  constructor(ctx){
    this.ctx = ctx;
    const typeId = this.randomizeTetrominos(COLORS.length);
    this.color = COLORS[typeId];
    this.shape = SHAPES[typeId];
    this.shade = SHADES[typeId];
    this.x = 3;
    this.y = 0;
  }
  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.shade; // set stroke color to semi-transparent black
    this.ctx.lineWidth = 0.1; // set stroke width to 2 pixels
    
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          const squareX = this.x + x;
          const squareY = this.y + y;
          
          // draw the square with fill and stroke
          this.ctx.fillRect(squareX, squareY, 1, 1);
          this.ctx.strokeRect(squareX , squareY , 1, 1);
          
          // add shading to the square by drawing darker lines on the edges facing away from the light source
          if (y > 0 && this.shape[y-1][x] === 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(squareX, squareY);
            this.ctx.lineTo(squareX + 1, squareY);
            this.ctx.stroke();
          }
          if (x < this.shape[0].length - 1 && this.shape[y][x+1] === 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(squareX + 1, squareY);
            this.ctx.lineTo(squareX + 1, squareY + 1);
            this.ctx.stroke();
          }
          if (y < this.shape.length - 1 && this.shape[y+1][x] === 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(squareX, squareY + 1);
            this.ctx.lineTo(squareX + 1, squareY + 1);
            this.ctx.stroke();
          }
          if (x > 0 && this.shape[y][x-1] === 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(squareX, squareY);
            this.ctx.lineTo(squareX, squareY + 1);
            this.ctx.stroke();
          }
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

  darkenColor(rgbaString, factor) {
    const rgbaMatch = rgbaString.match(/rgba\((\d+), (\d+), (\d+), (\d+(?:\.\d+)?)\)/);
    if (!rgbaMatch) return null;
    
    const [, r, g, b, a] = rgbaMatch.map(parseFloat);
    const darkenFactor = factor || 0.2; // Default to 0.2 if factor is not provided
    return `rgba(${r * darkenFactor}, ${g * darkenFactor}, ${b * darkenFactor}, ${a})`;
  }
}