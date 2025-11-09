const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const flapSound = document.getElementById("flapSound");
const hitSound = document.getElementById("hitSound");
const bgMusic = document.getElementById("bgMusic");
const gameOverDiv = document.getElementById("gameOver");
const scoreText = document.getElementById("scoreText");
const restartBtn = document.getElementById("restart");

let bird, pipes, gravity, jump, score, gameRunning, backgroundX;

// 🐦 Bird sprite
const birdImg = new Image();
birdImg.src = "https://i.imgur.com/syK7d2K.png";

// 🏞️ Background and Pipe
const bgImg = new Image();
bgImg.src = "https://i.imgur.com/krRldVh.png";
const pipeImg = new Image();
pipeImg.src = "https://i.imgur.com/sylXqJY.png";

function resetGame() {
  bird = { x: 80, y: 300, width: 34, height: 24, velocity: 0 };
  pipes = [];
  gravity = 0.4;
  jump = -7;
  score = 0;
  backgroundX = 0;
  gameRunning = true;
  gameOverDiv.classList.add("hidden");
  bgMusic.currentTime = 0;
  bgMusic.play();
}

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawBackground() {
  backgroundX -= 1;
  if (backgroundX <= -canvas.width) backgroundX = 0;
  ctx.drawImage(bgImg, backgroundX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, backgroundX + canvas.width, 0, canvas.width, canvas.height);
}

function createPipe() {
  const gap = 130;
  const topY = Math.random() * (canvas.height - gap - 200) + 50;
  pipes.push({
    x: canvas.width,
    top: topY,
    bottom: topY + gap,
    width: 60
  });
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.drawImage(pipeImg, pipe.x, pipe.top - 500, pipe.width, 500);
    ctx.drawImage(pipeImg, pipe.x, pipe.bottom, pipe.width, 500);
  });
}

function update() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  // Bird physics
  bird.velocity += gravity;
  bird.y += bird.velocity;
  drawBird();

  // Pipes
  if (Math.random() < 0.02) createPipe();

  pipes.forEach((pipe, i) => {
    pipe.x -= 2;
    if (pipe.x + pipe.width < 0) pipes.splice(i, 1);
    if (pipe.x === bird.x) score++;
  });

  drawPipes();

  // Collisions
  pipes.forEach(pipe => {
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      endGame();
    }
  });

  if (bird.y + bird.height >= canvas.height || bird.y < 0) endGame();

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(update);
}

function flap() {
  if (!gameRunning) return;
  bird.velocity = jump;
  flapSound.currentTime = 0;
  flapSound.play();
}

function endGame() {
  hitSound.play();
  bgMusic.pause();
  gameRunning = false;
  scoreText.textContent = `Final Score: ${score}`;
  gameOverDiv.classList.remove("hidden");
}

canvas.addEventListener("click", flap);
restartBtn.addEventListener("click", resetGame);

resetGame();
update();
