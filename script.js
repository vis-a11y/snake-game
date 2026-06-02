const board = document.querySelector(".board");
const blockHeight = 50;
const blockWidth = 50;
const startBtn = document.querySelector(".start-btn");
const startGameModal = document.querySelector(".modal .start-game");
const gameOverModal = document.querySelector(".modal .game-over");
const resetBtn = document.querySelector(".restart-btn");
const modal = document.querySelector(".modal");
const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const timeElement = document.querySelector("#time");

// Show start modal only at first load
if (gameOverModal) gameOverModal.style.display = "none";
if (startGameModal) startGameModal.style.display = "flex";

let cols = 0;
let rows = 0;
let intervalId = null;
let timeIntervalId = null;
let food = {
  x: 0,
  y: 0,
};
let score = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;
let time = "00:00";
highScoreElement.innerText = highScore;

let direction = "right";
const blocks = [];
let snake = [
  {
    x: 1,
    y: 3,
  },
];

// Initialize board dimensions and blocks
function initializeBoard() {
  cols = Math.floor(board.clientWidth / blockWidth);
  rows = Math.floor(board.clientHeight / blockHeight);

  // Clear existing blocks
  board.innerHTML = "";
  Object.keys(blocks).forEach((key) => delete blocks[key]);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const block = document.createElement("div");
      block.classList.add("block");
      board.appendChild(block);

      block.dataset.pos = `${row},${col}`;
      blocks[`${row},${col}`] = block;
    }
  }

  // Initialize food position
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
}

// Initialize board when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeBoard);
} else {
  initializeBoard();
}

// render the snake and food
function renderSnake() {
  snake.forEach((segment) => {
    const key = `${segment.x},${segment.y}`;
    const block = blocks[key];
    if (block) {
      block.classList.add("fill");
    }
  });
  const foodKey = `${food.x},${food.y}`;
  const foodBlock = blocks[foodKey];
  if (foodBlock) {
    foodBlock.classList.add("food");
  }
}

function gameLoop() {
  let head = null;

  // direction control
  if (direction === "left") {
    head = {
      x: snake[0].x,
      y: snake[0].y - 1,
    };
  } else if (direction === "right") {
    head = {
      x: snake[0].x,
      y: snake[0].y + 1,
    };
  } else if (direction === "up") {
    head = {
      x: snake[0].x - 1,
      y: snake[0].y,
    };
  } else if (direction === "down") {
    head = {
      x: snake[0].x + 1,
      y: snake[0].y,
    };
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    if (timeIntervalId) clearInterval(timeIntervalId);
    timeIntervalId = null;
    return;
  }

  // food collision consume
  let ateFood = false;
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x},${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
    blocks[`${food.x},${food.y}`].classList.add("food");

    ateFood = true;
    score += 10;
    scoreElement.innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreElement.innerText = highScore;
    }
  }

  // self collision
  snake.forEach((segment) => {
    blocks[`${segment.x},${segment.y}`].classList.remove("fill");
  });
  snake.unshift(head);
  if (!ateFood) snake.pop();

  renderSnake();
}

// direction control - keyboard
addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    direction = "left";
  } else if (e.key === "ArrowRight") {
    direction = "right";
  } else if (e.key === "ArrowUp") {
    direction = "up";
  } else if (e.key === "ArrowDown") {
    direction = "down";
  }
});

// direction control - touch swipe
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
});

document.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;
  const swipeThreshold = 30;

  // Determine swipe direction
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (diffX > swipeThreshold) {
      // Swiped left
      direction = "left";
    } else if (diffX < -swipeThreshold) {
      // Swiped right
      direction = "right";
    }
  } else {
    // Vertical swipe
    if (diffY > swipeThreshold) {
      // Swiped up
      direction = "up";
    } else if (diffY < -swipeThreshold) {
      // Swiped down
      direction = "down";
    }
  }
});

function resetGame() {
  score = 0;
  time = "00:00";
  scoreElement.innerText = score;
  timeElement.innerText = time;
  highScoreElement.innerText = highScore;

  modal.style.display = "none";
  startGameModal.style.display = "flex";
  gameOverModal.style.display = "none";

  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  if (timeIntervalId) clearInterval(timeIntervalId);
  timeIntervalId = null;

  // clear board visuals (prevents old snake/food staying on screen)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const block = blocks[`${row},${col}`];
      if (block) {
        block.classList.remove("fill");
        block.classList.remove("food");
      }
    }
  }

  snake = [
    {
      x: 1,
      y: 3,
    },
  ];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  renderSnake();
  intervalId = setInterval(gameLoop, 400);

  timeIntervalId = setInterval(() => {
    let [minutes, seconds] = time.split(":").map(Number);
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }
    time = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    timeElement.innerText = time;
  }, 1000);
}

startBtn.addEventListener("click", () => {
  resetGame();
});

resetBtn.addEventListener("click", resetGame);
