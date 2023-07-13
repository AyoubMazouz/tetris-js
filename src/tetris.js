const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const previewCanvas = document.getElementById("preview");
const previewCtx = previewCanvas.getContext("2d");

const scoreLabel = document.getElementById("score");
const levelLabel = document.getElementById("level");
const linesLabel = document.getElementById("lines");
const trtLabel = document.getElementById("trt");
const hightScoreLabel = document.getElementById("hight-score");
const pauseBtn = document.getElementById("pause");
const restartBtn = document.getElementById("reset");

canvas.width = canvasSize.width;
canvas.height = canvasSize.height;
previewCanvas.width = blockSize * 5;
previewCanvas.height = blockSize * 5;

const copyArray = (arr) => JSON.parse(JSON.stringify(arr));
const getRandomIndex = () => (Math.random() * matrixes.length) | 0;
let board;
let deltaTime;
const player = {
  score: 0,
  lines: 0,
  level: 3,
  trs: 0,
  trt: 0,
  speed: speedPerLevel[0] * 16.666,
  hightScore: localStorage.getItem("hightScore") ? localStorage.getItem("hightScore") : 0,
  isGameOver: false,
  isPaused: false,
  pos: { x: ((boardSize.x / 2) | 0) - 2, y: -1 },
  matrix: null,
  nextMatrix: null,

  getPlayerOffset() {
    return { x: this.pos.x * blockSize, y: this.pos.y * blockSize };
  },
};

const updateScoreLabel = () => (scoreLabel.innerHTML = player.score);
const updateLevelLabel = () => (levelLabel.innerHTML = player.level);
const updateLinesLabel = () => (linesLabel.innerHTML = player.lines);
const updateTrtLabel = () => (trtLabel.innerHTML = player.trt);
const updateHightScoreLabel = () => (hightScoreLabel.innerHTML = player.hightScore);

const clear = () => {
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
};

const clearPreview = () => {
  previewCtx.fillStyle = colors[0][0];
  previewCtx.fillRect(0, 0, canvasSize.width, canvasSize.height);
};

const getNextMatrix = () => {
  if (player.nextMatrix === null && player.matrix === null) {
    player.matrix = copyArray(matrixes[getRandomIndex()]);
    player.nextMatrix = copyArray(matrixes[getRandomIndex()]);
  } else {
    player.matrix = player.nextMatrix;
    player.nextMatrix = copyArray(matrixes[getRandomIndex()]);
  }
};

const rotate2dArray = (matrix, n) => {
  const len = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let i = 0; i < len; i++) {
      for (let j = i; j < len; j++) {
        [matrix[j][i], matrix[i][j]] = [matrix[i][j], matrix[j][i]];
      }
    }
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len / 2; j++) {
        [matrix[i][j], matrix[i][len - 1 - j]] = [matrix[i][len - 1 - j], matrix[i][j]];
      }
    }
  }
  return matrix;
};

const drawGradientBlock = (context, x, y, colorId) => {
  const [color1, color2] = colors[colorId];
  let gradient = context.createLinearGradient(x, y, x + blockSize, y + blockSize);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  context.fillStyle = gradient;
  context.fillRect(x, y, blockSize, blockSize);
};

const drawBorder = (context, x, y, width, height, colorId = 0, thickness = 2) => {
  context.strokeStyle = colors[colorId][0];
  context.lineWidth = thickness;
  context.strokeRect(x, y, width, height);
};

const drawMatrix = (context, matrix, offset = { x: 0, y: 0 }) => {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        drawGradientBlock(context, x * blockSize + offset.x, y * blockSize + offset.y, value);
        drawBorder(
          context,
          x * blockSize + offset.x,
          y * blockSize + offset.y,
          blockSize,
          blockSize
        );
      }
    });
  });
};

const drawPreview = () => {
  let offset;
  switch (player.nextMatrix.length) {
    case 2:
      offset = 1.5;
      break;
    case 4:
      offset = 0.5;
      break;
    default:
      offset = 1;
  }
  drawMatrix(previewCtx, player.nextMatrix, { x: blockSize * offset, y: blockSize * 1 });
};

const updateStats = (numberOfLines) => {
  player.lines += numberOfLines;
  player.trt = ((player.trs / player.lines) * 100) | 0;
  if (player.score < 10e5) player.score += scoreSys[numberOfLines - 1];
  if (linesPerLevel[player.lines]) player.level = linesPerLevel[player.lines];
  if (speedPerLevel[player.level]) player.speed = speedPerLevel[player.level] * deltaTime;
};

const updateHightScore = () => {
  if (player.score > player.hightScore) player.hightScore = player.score;
  localStorage.setItem("hightScore", `${player.hightScore}`);
};

const createBoard = () => {
  let board = [];
  for (let i = 0; i < boardSize.y; i++) {
    board.push(new Array(boardSize.x).fill(0));
  }
  return board;
};

const collide = (player, board) => {
  let margin = player.pos.y >= 0 ? 0 : Math.abs(player.pos.y);
  for (let y = 0; y < player.matrix.length; ++y) {
    for (let x = 0; x < player.matrix.length; ++x) {
      if (
        player.matrix[y][x] !== 0 &&
        (player.pos.y + y >= board.length ||
          board[y + player.pos.y + margin][x + player.pos.x] !== 0)
      ) {
        return true;
      }
    }
  }
  return false;
};

const merge = (player, board) => {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        board[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
  player.pos.y = 0;
};

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
        y++;
      }
    }
  }
  if (line == 4) player.trs += 4;
  if (line) {
    updateStats(line);
    updateScoreLabel();
    updateLinesLabel();
    updateTrtLabel();
    updateLevelLabel();
    line = 0;
  }
};

const reset = () => {
  player.pos.x = ((boardSize.x / 2) | 0) - ((player.matrix.length / 2) | 0);
  player.pos.y = -1;
  getNextMatrix();
  if (collide(player, board) || player.isGameOver) {
    board.forEach((row) => {
      row.fill(0);
    });
    updateHightScore();
    player.score = 0;
    player.lines = 0;
    player.level = 0;
    player.trt = 0;
    player.trs = 0;
    player.speed = speedPerLevel[0] * deltaTime;
    player.isGameOver = false;
    getNextMatrix();
    updateScoreLabel();
    updateLinesLabel();
    updateLevelLabel();
    updateHightScoreLabel();
  }
};

const drop = () => {
  player.pos.y++;
  if (collide(player, board) || player.pos.y > boardSize.y) {
    player.pos.y--;
    merge(player, board);
    reset();
    clearLine();
  }
};

const hardDrop = () => {
  while (true) {
    player.pos.y++;
    if (collide(player, board) || player.pos.y > boardSize.y) {
      player.pos.y--;
      merge(player, board);
      reset();
      clearLine();
      break;
    }
  }
};

const move = (dir) => {
  player.pos.x += dir;
  if (collide(player, board)) player.pos.x -= dir;
};

const rotate = (matrix) => {
  let rotatedMatrix = rotate2dArray(matrix, 3);
  let offset = 1;
  const posX = player.pos.x;
  while (collide(player, board)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix.length + 1) {
      rotatedMatrix = rotate2dArray([...matrix], 1);
      player.pos.x = posX;
    }
  }
  player.matrix = rotatedMatrix;
};

const previewSkeleton = () => {
  let skeleton = { pos: { ...player.pos }, matrix: [...player.matrix] };
  while (true) {
    skeleton.pos.y++;
    if (collide(skeleton, board) || skeleton.pos.y > boardSize.y) {
      skeleton.pos.y--;
      break;
    }
  }
  if (skeleton.pos.y - player.pos.y > 3) {
    skeleton.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          drawBorder(
            ctx,
            blockSize * (x + skeleton.pos.x),
            blockSize * (y + skeleton.pos.y),
            blockSize,
            blockSize,
            value
          );
        }
      });
    });
  }
};

const pause = () => {
  player.isPaused = !player.isPaused;
  dropCounter = 0;
  update();
};

const drawGame = () => {
  clear();
  drawMatrix(ctx, board);
  previewSkeleton();
  drawMatrix(ctx, player.matrix, player.getPlayerOffset());
  clearPreview();
  drawPreview(ctx, player.matrix);
};

let dropCounter = 0;
let lastTime = 0;
const update = (time = 0) => {
  deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (!player.isPaused) {
    if (dropCounter > player.speed) {
      drop();
      dropCounter = 0;
    }
    drawGame();
    requestAnimationFrame(update);
  }
};

document.addEventListener("keydown", (event) => {
  if (!player.isPaused) {
    // left-right-up-down
    if (event.keyCode === 37 || event.keyCode === 65) {
      move(-1);
    } else if (event.keyCode === 39 || event.keyCode === 68) {
      move(1);
    } else if (event.keyCode === 40 || event.keyCode === 83) {
      drop();
      dropCounter = 0;
    } else if (event.keyCode === 38 || event.keyCode === 87) {
      rotate(player.matrix);
    } else if (event.keyCode === 32) {
      hardDrop();
      dropCounter = 0;
    }
  } else if (event.keyCode === 80) {
    pause();
  } else if (event.keyCode === 82) {
    player.isGameOver = true;
    reset();
  }
});

pauseBtn.addEventListener("click", () => {
  pause();
});
restartBtn.addEventListener("click", () => {
  player.isGameOver = true;
  reset();
});

const init = () => {
  board = createBoard();
  getNextMatrix();
  update();
  updateHightScoreLabel();
};
init();
