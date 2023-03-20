const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;


const KEYS = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
}

const MOVES = {
  [KEYS.LEFT] : (p) => ({...p, x : p.x - 1}),
  [KEYS.RIGHT] : (p) => ({...p, x : p.x + 1}),
  [KEYS.DOWN] : (p) => ({...p, y : p.y + 1}),
  [KEYS.UP] : (p) => rotateCw(p)
}

function rotateCw(piece) {

  //clone
  let p = JSON.parse(JSON.stringify(piece));


  //Transpose
  for(let y = 0; y < p.shape.length; y++){
    for(let x = 0; x < y; x++){
      [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
    }
  }

  //Reverse
  p.shape.forEach(row => row.reverse());

  return p;

}
