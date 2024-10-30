const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const startButton = document.getElementById("startButton");

canvas.width = 600;
canvas.height = 400;

let score = 0;
let level = 1;
let spaceship, aliens, bullets;
let gameInterval;
let alienSpeed = 1;

function startGame() {
    startButton.style.display = "none";
    score = 0;
    level = 1;
    alienSpeed = 1;
    setupGame();
    gameInterval = setInterval(updateGame, 20);
}

function setupGame() {
    spaceship = { x: canvas.width / 2 - 25, y: canvas.height - 50, width: 50, height: 30, color: "white" };
    aliens = [];
    bullets = [];
    createAliens();
}

function createAliens() {
    aliens = [];
    for (let i = 0; i < level * 3; i++) {  // Increases number of aliens per level
        aliens.push({
            x: Math.random() * (canvas.width - 30),
            y: Math.random() * 100,
            width: 30,
            height: 30,
            color: "red",
            isAlive: true,
        });
    }
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSpaceship();
    drawSpaceship();
    moveBullets();
    drawBullets();
    moveAliens();
    drawAliens();
    checkCollisions();
    updateScore();
}

function moveSpaceship() {
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft" && spaceship.x > 0) spaceship.x -= 10;
        if (e.key === "ArrowRight" && spaceship.x < canvas.width - spaceship.width) spaceship.x += 10;
    });
}

function drawSpaceship() {
    ctx.fillStyle = spaceship.color;
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y < 0) bullets.splice(index, 1);
    });
}

function drawBullets() {
    bullets.forEach((bullet) => {
        ctx.fillStyle = "yellow";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function moveAliens() {
    aliens.forEach((alien) => {
        alien.y += alienSpeed;
        if (alien.y > canvas.height) {
            alien.y = Math.random() * 100;
            alien.x = Math.random() * (canvas.width - alien.width);
        }
    });
}

function drawAliens() {
    aliens.forEach((alien) => {
        if (alien.isAlive) {
            ctx.fillStyle = alien.color;
            ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
        }
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        aliens.forEach((alien) => {
            if (
                alien.isAlive &&
                bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.y + bullet.height > alien.y
            ) {
                alien.isAlive = false;
                bullets.splice(bulletIndex, 1);
                score += 10;
                if (aliens.every((alien) => !alien.isAlive)) {
                    level++;
                    alienSpeed += 0.5;
                    if (level > 20) gameOver();  // Ends game after 20 levels
                    else createAliens();
                }
            }
        });
    });
}

function updateScore() {
    scoreDisplay.innerText = score;
    levelDisplay.innerText = level;
}

document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
        bullets.push({ x: spaceship.x + spaceship.width / 2 - 2, y: spaceship.y, width: 4, height: 10 });
    }
});

function gameOver() {
    clearInterval(gameInterval);
    startButton.style.display = "block";
    alert(`Congratulations! You completed 20 levels with a final score of ${score}`);
}
