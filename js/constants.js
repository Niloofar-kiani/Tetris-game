const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const COLORS = ["#920c55", "#ee203f", "#32b72b", "#3822ab","#ffc90e", "#e94b87", "#fb6a40"]
const COLORSM = ["#0f380f", "#0f380f", "#0f380f", "#0f380f","#0f380f", "#0f380f", "#0f380f"]
const SHADES = ["rgba(10, 10, 10, 0.2)", "rgba(10, 10, 10, 0.2)", "rgba(10, 10, 10, 0.2)", "rgba(10, 10, 10, 0.2)","rgba(10, 10, 10, 0.2)", "rgba(10, 10, 10, 0.2)", "rgba(10, 10, 10, 0.2)"]
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
];

const POINTS = {
  SOFT_DROP: 1,
  HARD_DROP: 2,
};
Object.freeze(POINTS);

const LINE_TO_POINTS = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};
Object.freeze(LINE_TO_POINTS);

const LINES_PER_LEVEL = 1;
const LEVEL = {
  0: 800,
  1: 720,
  2: 630,
  3: 550,
  4: 470,
  5: 380,
  6: 300,
  7: 220,
  8: 130,
  9: 100,
  10: 80,
};
Object.freeze(LEVEL);


const NO_OF_HIGH_SCORES = 10;
const HIGH_SCORES = "highScores";


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

function rotateCw(tetromino) {

  //clone
  let p = JSON.parse(JSON.stringify(tetromino));


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