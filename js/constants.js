const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const COLORS = ["cyan", "blue", "orange", "yellow","green", "purple", "red"]

const SHAPES = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ], 
  [
    [4, 4],
    [4, 4],
  ],
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
]

const KEYS = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
}

const MOVES = {
  [KEYS.LEFT] : (p) => ({...p, x : p.x - 1}),
  [KEYS.RIGHT] : (p) => ({...p, x : p.x + 1}),
  [KEYS.DOWN] : (p) => ({...p, y : p.y + 1}),
  [KEYS.UP] : (p) => rotateCw(p),
  [KEYS.SPACE] : (p) => ({...p, y : p.y + 1})
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
