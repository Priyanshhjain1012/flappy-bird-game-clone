// Bird, pipe, and game area configuration
const bird = document.getElementById('bird');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
let birdY = 100;
let birdVelocity = 0;
let gravity = 0.15;
let isGameOver = false;
let pipes = [];
let score = 0;

// Bird flapping
function flap() {
  birdVelocity = -5; // Set upward velocity
}

// Pipe creation
function createPipe() {
  const pipeGap = 180;
  const pipeWidth = 60;
  const pipeHeight = Math.floor(Math.random() * (gameArea.clientHeight - pipeGap - 50)) + 20;

  // Top pipe
  const pipeTop = document.createElement('div');
  pipeTop.classList.add('pipe', 'pipe-top');
  pipeTop.style.height = `${pipeHeight}px`;
  pipeTop.style.left = `${gameArea.clientWidth}px`;

  // Bottom pipe
  const pipeBottom = document.createElement('div');
  pipeBottom.classList.add('pipe', 'pipe-bottom');
  pipeBottom.style.height = `${gameArea.clientHeight - pipeHeight - pipeGap}px`;
  pipeBottom.style.left = `${gameArea.clientWidth}px`;

  // Add pipes to game area and pipes array
  gameArea.appendChild(pipeTop);
  gameArea.appendChild(pipeBottom);
  pipes.push({ top: pipeTop, bottom: pipeBottom });
}

// Move pipes and check for offscreen pipes
function movePipes() {
  pipes.forEach((pipe, index) => {
    const pipeLeft = parseInt(pipe.top.style.left);
    pipe.top.style.left = pipe.bottom.style.left = `${pipeLeft - 3}px`;

    // Remove pipes that go offscreen and increase score
    if (pipeLeft < -50) {
      pipe.top.remove();
      pipe.bottom.remove();
      pipes.splice(index, 1);
      score++;
      scoreDisplay.textContent = score;
    }

    // Collision detection
    const birdRect = bird.getBoundingClientRect();
    const topRect = pipe.top.getBoundingClientRect();
    const bottomRect = pipe.bottom.getBoundingClientRect();

    if (
      (birdRect.right > topRect.left && birdRect.left < topRect.right &&
       birdRect.bottom > topRect.top && birdRect.top < topRect.bottom) ||
      (birdRect.right > bottomRect.left && birdRect.left < bottomRect.right &&
       birdRect.bottom > bottomRect.top && birdRect.top < bottomRect.bottom)
    ) {
      gameOver();
    }
  });
}

// Game over function
function gameOver() {
  isGameOver = true;
  alert(`Game Over! Your score is: ${score}`);
  window.location.reload();
}

// Game loop
function gameLoop() {
  if (isGameOver) return;

  // Apply gravity to bird and update position
  birdVelocity += gravity;
  birdY += birdVelocity;
  bird.style.top = `${birdY}px`;

  // Check if bird hits the ground or ceiling
  if (birdY > gameArea.clientHeight - bird.clientHeight || birdY < 0) {
    gameOver();
  }

  // Move pipes and create new ones periodically
  movePipes();
  if (pipes.length === 0 || parseInt(pipes[pipes.length - 1].top.style.left) < gameArea.clientWidth - 300)
    {
    createPipe();
  }

  requestAnimationFrame(gameLoop);
}

// Start game loop on page load
gameLoop();

// Bird flap on spacebar press
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') flap();
});

document.addEventListener('touchstart', (e) => {
    flap();
});
