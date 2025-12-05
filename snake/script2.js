// === Chargement des images de sprite ===
const SPRITE_PATHS = {
  up: "pingouin_arriere.png",
  down: "pingouin_avant.png",
  left: "pingouin_avant.png",
  right: "pingouin_final.png",
  fish: "poisson.png"
};

class SpriteLoader {
  constructor(paths) {
    this.paths = paths;
    this.images = {};
  }

  loadAll() {
    const promises = Object.entries(this.paths).map(([key, src]) =>
      this.loadImage(src).then(img => {
        this.images[key] = img;
      })
    );
    return Promise.all(promises);
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }
}

// === Classe Snake ===
class Snake {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.reset();
  }

  reset() {
    const startX = Math.floor(this.cols / 2);
    const startY = Math.floor(this.rows / 2);
    this.body = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ];
    this.direction = "right";
    this.nextDirection = "right";
    this.growPending = 0;
  }

  setDirection(dir) {
    const opposites = {
      up: "down",
      down: "up",
      left: "right",
      right: "left"
    };
    if (dir !== opposites[this.direction]) {
      this.nextDirection = dir;
    }
  }

  update() {
    this.direction = this.nextDirection;

    const head = this.body[0];
    let newHead = { x: head.x, y: head.y };

    switch (this.direction) {
      case "up": newHead.y -= 1; break;
      case "down": newHead.y += 1; break;
      case "left": newHead.x -= 1; break;
      case "right": newHead.x += 1; break;
    }

    this.body.unshift(newHead);

    if (this.growPending > 0) this.growPending--;
    else this.body.pop();
  }

  grow(amount = 1) {
    this.growPending += amount;
  }

  getHead() {
    return this.body[0];
  }

  isOutOfBounds() {
    const h = this.getHead();
    return h.x < 0 || h.y < 0 || h.x >= this.cols || h.y >= this.rows;
  }

  hasSelfCollision() {
    const [head, ...rest] = this.body;
    return rest.some(s => s.x === head.x && s.y === head.y);
  }

  occupiesPosition(x, y) {
    return this.body.some(s => s.x === x && s.y === y);
  }
}

// === Classe Food ===
class Food {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.position = { x: 0, y: 0 };
  }

  placeRandomly(snake) {
    let x, y;
    do {
      x = Math.floor(Math.random() * this.cols);
      y = Math.floor(Math.random() * this.rows);
    } while (snake.occupiesPosition(x, y));

    this.position = { x, y };
  }
}

// === Classe Game ===
class Game {
  constructor(canvas, scoreElement, spriteLoader) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.scoreElement = scoreElement;
    this.spriteLoader = spriteLoader;

    this.tileSize = 32;
    this.cols = canvas.width / this.tileSize;
    this.rows = canvas.height / this.tileSize;

    this.snake = new Snake(this.cols, this.rows);
    this.food = new Food(this.cols, this.rows);
    this.food.placeRandomly(this.snake);

    this.score = 0;
    this.baseSpeed = 150;
    this.speed = this.baseSpeed;
    this.timerId = null;
    this.isRunning = false;

    this.bindKeyboard();
    this.draw();
  }

  bindKeyboard() {
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp": this.snake.setDirection("up"); break;
        case "ArrowDown": this.snake.setDirection("down"); break;
        case "ArrowLeft": this.snake.setDirection("left"); break;
        case "ArrowRight": this.snake.setDirection("right"); break;
      }
    });
  }

  start() {
    this.reset();
    this.isRunning = true;
    this.loop();
  }

  reset() {
    this.snake.reset();
    this.food.placeRandomly(this.snake);
    this.score = 0;
    this.speed = this.baseSpeed;
    this.updateScoreUI();
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = null;
  }

  loop() {
    this.timerId = setInterval(() => {
      this.update();
      this.draw();
    }, this.speed);
  }

  gameOver() {
    this.isRunning = false;
    clearInterval(this.timerId);
    this.timerId = null;

    setTimeout(() => alert("Game Over ! Score : " + this.score), 10);
  }

  updateScoreUI() {
    this.scoreElement.textContent = this.score;
  }

  update() {
    if (!this.isRunning) return;

    this.snake.update();

    if (this.snake.isOutOfBounds() || this.snake.hasSelfCollision()) {
      this.gameOver();
      return;
    }

    const h = this.snake.getHead();
    if (h.x === this.food.position.x && h.y === this.food.position.y) {
      this.snake.grow(1);
      this.score += 10;
      this.updateScoreUI();

      this.speed = Math.max(60, this.speed - 5);
      clearInterval(this.timerId);
      this.loop();

      this.food.placeRandomly(this.snake);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawFood();
    this.drawSnake();
  }

  drawFood() {
    const img = this.spriteLoader.images.fish;
    const { x, y } = this.food.position;
    const px = x * this.tileSize;
    const py = y * this.tileSize;

    if (img) this.ctx.drawImage(img, px, py, this.tileSize, this.tileSize);
    else {
      this.ctx.fillStyle = "#2f855a";
      this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
    }
  }

  drawSnake() {
    const body = this.snake.body;

    const headImg = this.getHeadSprite();
    const babyImg = headImg; // même direction que la tête
    const babySize = this.tileSize * 0.75;
    const offset = (this.tileSize - babySize) / 2;

    // --- corps (bébés pingouins dans la même direction) ---
    for (let i = 1; i < body.length; i++) {
      const seg = body[i];
      const px = seg.x * this.tileSize + offset;
      const py = seg.y * this.tileSize + offset;
      this.ctx.drawImage(babyImg, px, py, babySize, babySize);
    }

    // --- tête (grand pingouin) ---
    const head = body[0];
    this.ctx.drawImage(
      headImg,
      head.x * this.tileSize,
      head.y * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }

  getHeadSprite() {
    return this.spriteLoader.images[this.snake.direction];
  }
}

// === Initialisation ===
window.addEventListener("load", () => {
  const canvas = document.getElementById("gameCanvas");
  const scoreElement = document.getElementById("score");
  const startBtn = document.getElementById("startBtn");

  const loader = new SpriteLoader(SPRITE_PATHS);

  loader.loadAll().then(() => {
    const game = new Game(canvas, scoreElement, loader);
    startBtn.addEventListener("click", () => game.start());
  });
});