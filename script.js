const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

const blockSize = 30;
const boardSize = { x: 10, y: 20 };
const gameSize = {
  width: boardSize.x * blockSize,
  height: boardSize.y * blockSize,
};

const gameOff = {
  x: blockSize / 2,
  y: blockSize / 2
}

const sideOff = {
  x: blockSize * boardSize.x + blockSize * .75,
  y: blockSize / 4
}


const canvasSize = {
  width: blockSize * 17,
  height: blockSize * 21
}

canvas.width = canvasSize.width;
canvas.height = canvasSize.height;

const scoreSys = [40, 100, 300, 1200]

const borders = [
  // game border
  {
    x: blockSize / 4,
    y: blockSize / 4,
    width: gameSize.width + blockSize / 2,
    height: gameSize.height + blockSize / 2,
  },
  // score border
  {
    x: sideOff.x,
    y: sideOff.y,
    width: blockSize * 6,
    height: blockSize * 4,
  },
  // lines border
  {
    x: sideOff.x,
    y: sideOff.y + blockSize * 4,
    width: blockSize * 6,
    height: blockSize * 4,
  },
  // next piece border
  {
    x: sideOff.x,
    y: sideOff.y + blockSize * 8,
    width: blockSize * 6,
    height: blockSize * 7,
  },
  // hight score border
  {
    x: sideOff.x,
    y: sideOff.y + blockSize * 15,
    width: blockSize * 6,
    height: blockSize * 5.5,
  }
]

const labels = {
  score: {
    x: sideOff.x + blockSize / 2,
    y: sideOff.y + blockSize * 1.75
  },
  lines: {
    x: sideOff.x + blockSize / 2,
    y: sideOff.y + blockSize * 5.75
  },
  nextPiece: {
    x: sideOff.x + blockSize / 2,
    y: sideOff.y + blockSize * 9.75
  },
  hightScore: {
    x: sideOff.x + blockSize / 2,
    y: sideOff.y + blockSize * 16.75
  }
}

const colors = [
  null,
  '#F03E3E',
  '#F39B50',
  '#FEEE5E',
  '#A4CF09',
  '#4883D2',
  '#7349A2',
  '#0E9990',
  '#353535'
];

const matrixes = [
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [2, 2, 2, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [3, 3],
    [3, 3],
  ],
  [
    [4, 0, 0],
    [4, 4, 4],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [5, 5, 5],
    [0, 0, 5],
  ],
  [
    [6, 6, 0],
    [0, 6, 6],
    [0, 0, 0],
  ],
  [
    [0, 7, 7],
    [7, 7, 0],
    [0, 0, 0],
  ],
];

const copyArray = (arr) => JSON.parse(JSON.stringify(arr));

const getRandomIndex = () => (Math.random() * matrixes.length) | 0;

const numToString = (num) => {
  num = num.toString()
  while (num.length < 6) {
    num = '0' + num
  } return num
}

const clear = () => {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
}

const getNextMatrix = () => {
  if (player.nextMatrix === null && player.matrix === null) {
    player.matrix = copyArray(matrixes[getRandomIndex()]);
    player.nextMatrix = copyArray(matrixes[getRandomIndex()]);
  } else {
    player.matrix = player.nextMatrix;
    player.nextMatrix = copyArray(matrixes[getRandomIndex()]);
  }
}

const rotate2dArray = (matrix, dir) => {
  const len = matrix.length;
  if (dir === -1) {
    for (let i = 0; i < len; i++) {
      for (let j = i; j < len; j++) {
        [matrix[j][i], matrix[i][j]] = [matrix[i][j], matrix[j][i]];
      }
    }
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len / 2; j++) {
        [matrix[i][j], matrix[i][len - 1 - j]] = [
          matrix[i][len - 1 - j],
          matrix[i][j],
        ];
      }
    }
  } else {
    for (let i = 0; i < 3; i++) {
      for (let i = 0; i < len; i++) {
        for (let j = i; j < len; j++) {
          [matrix[j][i], matrix[i][j]] = [matrix[i][j], matrix[j][i]];
        }
      }
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len / 2; j++) {
          [matrix[i][j], matrix[i][len - 1 - j]] = [
            matrix[i][len - 1 - j],
            matrix[i][j],
          ];
        }
      }
    }
  }
  return matrix;
}

const drawBlock = (x, y, colorId) => {
  ctx.fillStyle = colors[colorId];
  ctx.fillRect(x, y, blockSize, blockSize);
}

const drawBorder = (x, y, width, height, thickness) => {
  ctx.strokeStyle = colors[colors.length - 1];
  ctx.lineWidth = thickness
  ctx.strokeRect(x, y, width, height);
}

const drawText = (text, x, y) => {
  ctx.font = `${blockSize}px Pixel`;
  ctx.fillStyle = '#eee';
  ctx.fillText(text, x, y);

}

const drawMatrix = (matrix, offset = { x: 0, y: 0 }) => {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        drawBlock(x * blockSize + offset.x,
          y * blockSize + offset.y, value);
        drawBorder(x * blockSize + offset.x,
          y * blockSize + offset.y,
          blockSize, blockSize, 2)
      }
    });
  });
}

const drawElements = (player) => {
  borders.forEach((border) => {
    drawBorder(
      border.x,
      border.y,
      border.width,
      border.height,
      blockSize / 2
    )
  })

  drawText(`Score:`,
    labels.score.x, labels.score.y)
  drawText(numToString(score),
    labels.score.x, labels.score.y + blockSize)
  drawText(`Lines:`,
    labels.lines.x, labels.lines.y)
  drawText(numToString(lines),
    labels.lines.x, labels.lines.y + blockSize)
  drawText(`Next:`,
    labels.nextPiece.x, labels.nextPiece.y)

  let offset;
  switch (player.nextMatrix.length) {
    case 2:
      offset = 2;
      break;
    case 4:
      offset = 1;
      break;
    default:
      offset = 1.5;
  }
  drawMatrix(player.nextMatrix,
    {
      x: sideOff.x + blockSize * offset,
      y: sideOff.y + blockSize * 10.75
    })

  drawText(`Hight`,
    labels.hightScore.x, labels.hightScore.y)
  drawText(`Score:`,
    labels.hightScore.x, labels.hightScore.y + blockSize)
  drawText(numToString(hightScore),
    labels.hightScore.x, labels.hightScore.y + blockSize * 2)


}

const updateScore = numberOfLines => {
  score += scoreSys[numberOfLines - 1]
}

const createBoard = () => {
  let board = [];
  for (let i = 0; i < boardSize.y; i++) {
    board.push(new Array(boardSize.x).fill(0));
  }
  return board;
}

const collide = (player, board) => {
  for (let y = 0; y < player.matrix.length; ++y) {
    for (let x = 0; x < player.matrix.length; ++x) {
      if (
        player.matrix[y][x] !== 0 &&
        (player.pos.y + y >= board.length ||
          board[y + player.pos.y][x + player.pos.x] !== 0)
      ) {
        return true;
      }
    }
  }
  return false;
}

const merge = (player, board) => {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        board[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
  player.pos.y = 0;
}

const reset = () => {
  player.pos.x = ((boardSize.x / 2) | 0) - ((player.matrix.length / 2) | 0);
  player.pos.y = 0;
  setNextMatrix();
  if (collide(player, board)) {
    board.forEach((row) => {
      row.fill(0);
    });
    if (score > hightScore) hightScore = score;
    score = 0;
    lines = 0;
    setNextMatrix();
  }
}

const clearLine = () => {
  let line = 0;
  let count = 0;
  for (let y = boardSize.y - 1; y > 0; y--) {
    for (let x = 0; x < boardSize.x; x++) {
      if (board[y][x] === 0) {
        count = 0;
        break;
      } else count++;

      if (count === boardSize.x) {
        const newRow = board.splice(y, 1)[0].fill(0);
        board.unshift(newRow);
        count = 0;
        line++;
        lines++;
        y++;
      }
    }
  }
  if (line) {
    updateScore(line)
    line = 0;
  }
}

const drop = () => {
  player.pos.y++;
  if (collide(player, board) || player.pos.y > boardSize.y) {
    player.pos.y--;
    merge(player, board);
    reset();
    clearLine();
  }
  dropCounter = 0;
}

const move = (dir) => {
  player.pos.x += dir;
  if (collide(player, board)) {
    player.pos.x -= dir;
  }
}

const rotate = (matrix) => {
  let rotatedMatrix = rotate2dArray(matrix);
  let offset = 1;
  const posX = player.pos.x;
  while (collide(player, board)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix.length + 1) {
      rotatedMatrix = rotate2dArray([...matrix], -1);
      player.pos.x = posX;
      console.log("matrix doesn't fit");
    }
  }
  player.matrix = rotatedMatrix;
}

function setNextMatrix() {
  getNextMatrix();
}

let score = 0;
let lines = 0;
let hightScore = 0;
let player = {
  pos: {
    x: ((boardSize.x / 2) | 0) - 2,
    y: 0,
  },
  matrix: null,
  nextMatrix: null,
  score: 0,

  getPlayerOffset() {
    return {
      x: this.pos.x * blockSize + gameOff.x,
      y: this.pos.y * blockSize + gameOff.y
    }
  }
};
let board = createBoard();
setNextMatrix();

const drawGame = () => {
  clear();
  drawElements(player)
  drawMatrix(board, gameOff);
  drawMatrix(player.matrix, player.getPlayerOffset());
}

const dropSpeed = 1000;
let dropCounter = 0;
let lastTime = 0;

const update = (time = 0) => {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropSpeed) {
    drop();
  }

  drawGame();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", (event) => {
  if (event.keyCode === 37) {
    move(-1);
  } else if (event.keyCode === 39) {
    move(1);
  } else if (event.keyCode === 40) {
    drop();
  } else if (event.keyCode === 38) {
    rotate(player.matrix);
  }
});

update();

