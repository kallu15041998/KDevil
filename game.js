const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 50, y: 300, width: 40, height: 40, dy: 0, jumping: false };
let gravity = 0.6;
let jumpPower = -12;
let obstacles = [];
let frame = 0;
let score = 0;

// Load assets
const playerImg = new Image();
playerImg.src = "assets/images/player.png";
const obstacleImg = new Image();
obstacleImg.src = "assets/images/devil.png";

const jumpSound = new Audio("assets/sounds/jump.wav");
const hitSound = new Audio("assets/sounds/hit.wav");

function update() {
  frame++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player physics
  player.y += player.dy;
  player.dy += gravity;
  if (player.y > 300) {
    player.y = 300;
    player.dy = 0;
    player.jumping = false;
  }

  // Draw player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Spawn obstacles
  if (frame % 120 === 0) {
    obstacles.push({ x: canvas.width, y: 320, width: 40, height: 40 });
  }

  // Move obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= 5;
    ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);

    // Collision
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      hitSound.play();
      alert("Game Over! Score: " + score);
      document.location.reload();
    }
  }

  // Remove offscreen obstacles
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  // Score
  score++;
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 650, 30);

  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !player.jumping) {
    player.dy = jumpPower;
    player.jumping = true;
    jumpSound.play();
  }
});

update();
