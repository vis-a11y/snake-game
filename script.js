const board = document.querySelector(".board");
const startBtn = document.querySelector(".start-btn");
const restartBtn = document.querySelector(".restart-btn");
const startPanel = document.querySelector(".modal .start-game");
const gameOverPanel = document.querySelector(".modal .game-over");
const modal = document.querySelector(".modal");
const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const timeElement = document.querySelector("#time");

const blockWidth = 40;
const blockHeight = 40;
const boardGap = 4;

let cols = 0;
let rows = 0;
let blocks = {};
let snake = [];
let food = { x: 0, y: 0 };
let direction = "right";
let nextDirection = "right";
let score = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;
let secondsElapsed = 0;
let intervalId = null;
let timeIntervalId = null;

highScoreElement.innerText = highScore;
scoreElement.innerText = score;
timeElement.innerText = formatTime(secondsElapsed);

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
}

function placeFood() {
  let position = getRandomPosition();
  while (snake.some((segment) => segment.x === position.x && segment.y === position.y)) {
    position = getRandomPosition();
  }
  return position;
}

function initializeBoard() {
  cols = Math.floor((board.clientWidth + boardGap) / (blockWidth + boardGap));
  rows = Math.floor((board.clientHeight + boardGap) / (blockHeight + boardGap));

  if (cols < 5 || rows < 5) {
    return;
  }

  board.innerHTML = "";
  blocks = {};

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const block = document.createElement("div");
      block.className = "block";
      block.dataset.pos = `${row},${col}`;
      board.appendChild(block);
      blocks[`${row},${col}`] = block;
    }
  }
}

function resetGame() {
  if (!board || !startBtn || !restartBtn) return;

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (timeIntervalId) {
    clearInterval(timeIntervalId);
    timeIntervalId = null;
  }

  score = 0;
  secondsElapsed = 0;
  direction = "right";
  nextDirection = "right";
  scoreElement.innerText = score;
  timeElement.innerText = formatTime(secondsElapsed);
  highScoreElement.innerText = highScore;

  initializeBoard();
  snake = [
    {
      x: Math.floor(rows / 2),
      y: Math.floor(cols / 2),
    },
  ];
  food = placeFood();
  renderBoard();
  showModal(false);

  intervalId = setInterval(gameLoop, 220);
  timeIntervalId = setInterval(() => {
    secondsElapsed += 1;
    timeElement.innerText = formatTime(secondsElapsed);
  }, 1000);
}

function showModal(showOver = false) {
  if (!modal) return;
  modal.style.display = "flex";
  startPanel.style.display = showOver ? "none" : "flex";
  gameOverPanel.style.display = showOver ? "flex" : "none";
}

function hideModal() {
  if (!modal) return;
  modal.style.display = "none";
}

function renderBoard() {
  Object.values(blocks).forEach((block) => {
    block.classList.remove("fill", "food");
  });

  snake.forEach((segment) => {
    const block = blocks[`${segment.x},${segment.y}`];
    if (block) {
      block.classList.add("fill");
    }
  });

  const foodBlock = blocks[`${food.x},${food.y}`];
  if (foodBlock) {
    foodBlock.classList.add("food");
  }
}

function endGame() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (timeIntervalId) {
    clearInterval(timeIntervalId);
    timeIntervalId = null;
  }
  showModal(true);
}

function gameLoop() {
  if (!snake.length) return;

  direction = nextDirection;
  const head = { ...snake[0] };

  if (direction === "left") head.y -= 1;
  if (direction === "right") head.y += 1;
  if (direction === "up") head.x -= 1;
  if (direction === "down") head.x += 1;

  const hitWall = head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols;
  const hitSelf = snake.some((segment) => segment.x === head.x && segment.y === head.y);
  if (hitWall || hitSelf) {
    endGame();
    return;
  }

  const ateFood = head.x === food.x && head.y === food.y;
  snake.unshift(head);

  if (ateFood) {
    score += 10;
    scoreElement.innerText = score;
    if (score > highScore) {
      highScore = score;
      highScoreElement.innerText = highScore;
      localStorage.setItem("highScore", highScore);
    }
    food = placeFood();
  } else {
    snake.pop();
  }

  renderBoard();
}

function handleKeydown(event) {
  const allowedKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
  if (!allowedKeys.includes(event.key) || !intervalId) return;

  if (event.key === "ArrowLeft" && direction !== "right") nextDirection = "left";
  if (event.key === "ArrowRight" && direction !== "left") nextDirection = "right";
  if (event.key === "ArrowUp" && direction !== "down") nextDirection = "up";
  if (event.key === "ArrowDown" && direction !== "up") nextDirection = "down";
}

window.addEventListener("resize", initializeBoard);
window.addEventListener("keydown", handleKeydown);

startBtn.addEventListener("click", () => {
  hideModal();
  resetGame();
});

restartBtn.addEventListener("click", () => {
  hideModal();
  resetGame();
});

initializeBoard();
renderBoard();
