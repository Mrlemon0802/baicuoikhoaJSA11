const gameArea = document.getElementById("game-area");
const player = document.getElementById("player");

let playerX = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
let playerY = gameArea.offsetHeight - player.offsetHeight;
let speed = 5;
let dashDistance = 120; // Khoảng cách lướt
let isDashing = false; // Trạng thái lướt
let isInvulnerable = false; // Trạng thái không bị sát thương
let lives = 4; // Số mạng sống ban đầu
let lasers = [];
let laserSpeed = 3;
let spawnInterval = 2000;
let difficultyIncreaseRate = 5000;

// Danh sách các phần cơ thể
const bodyParts = [
    document.getElementById("part-1"),
    document.getElementById("part-2"),
    document.getElementById("part-3"),
    document.getElementById("part-4"),
];

// Khởi tạo vị trí player
player.style.left = `${playerX}px`;
player.style.top = `${playerY}px`;

// Theo dõi trạng thái phím
let keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

// Lướt
function dash() {
    if (isDashing || isInvulnerable) return; // Ngăn spam lướt

    isDashing = true;
    isInvulnerable = true;

    // Thay đổi trạng thái hiển thị khi lướt
    player.style.opacity = "0.5";

    // Lướt theo hướng hiện tại
    const directionX = (keys["ArrowRight"] ? 1 : 0) - (keys["ArrowLeft"] ? 1 : 0);
    const directionY = (keys["ArrowDown"] ? 1 : 0) - (keys["ArrowUp"] ? 1 : 0);

    playerX = Math.max(
        0,
        Math.min(
            gameArea.offsetWidth - player.offsetWidth,
            playerX + directionX * dashDistance
        )
    );
    playerY = Math.max(
        0,
        Math.min(
            gameArea.offsetHeight - player.offsetHeight,
            playerY + directionY * dashDistance
        )
    );

    updatePlayerPosition();

    // Kết thúc lướt sau 0.3 giây
    setTimeout(() => {
        isDashing = false;

        // Trạng thái bất tử ngắn sau lướt
        setTimeout(() => {
            isInvulnerable = false;
            player.style.opacity = "1";
        }, 300);
    }, 300);
}

// Di chuyển player
function movePlayer() {
    if (!isDashing) {
        if (keys["ArrowLeft"]) playerX = Math.max(0, playerX - speed);
        if (keys["ArrowRight"])
            playerX = Math.min(
                gameArea.offsetWidth - player.offsetWidth,
                playerX + speed
            );
        if (keys["ArrowUp"]) playerY = Math.max(0, playerY - speed);
        if (keys["ArrowDown"])
            playerY = Math.min(
                gameArea.offsetHeight - player.offsetHeight,
                playerY + speed
            );
    }

    if (keys[" "]) dash(); // Nhấn Space để lướt

    updatePlayerPosition();
}

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

// Giảm mạng sống
function loseLife() {
    if (isInvulnerable || lives <= 0) return;

    lives--;
    bodyParts[lives].classList.add("hidden"); // Ẩn phần cơ thể

    if (lives === 0) {
        alert("Game Over!");
        clearInterval(gameInterval);
        location.reload();
    }
}

// Tạo tia laser
function spawnLaser() {
    const laser = document.createElement("div");
    laser.classList.add("laser");
    laser.style.left = `${Math.random() * (gameArea.offsetWidth - 10)}px`;
    laser.style.top = `0px`;
    gameArea.appendChild(laser);
    lasers.push(laser);
}

// Di chuyển tia laser
function moveLasers() {
    lasers.forEach((laser, index) => {
        const laserTop = parseInt(laser.style.top);
        if (laserTop > gameArea.offsetHeight) {
            laser.remove();
            lasers.splice(index, 1);
        } else {
            laser.style.top = `${laserTop + laserSpeed}px`;
        }

        checkCollision(laser);
    });
}

// Kiểm tra va chạm
function checkCollision(laser) {
    if (isInvulnerable) return;

    const laserRect = laser.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
        laserRect.left < playerRect.right &&
        laserRect.right > playerRect.left &&
        laserRect.top < playerRect.bottom &&
        laserRect.bottom > playerRect.top
    ) {
        isInvulnerable = true;
        loseLife(); // Mất một phần cơ thể khi va chạm

        setTimeout(() => {
            isInvulnerable = false;
        }, 1000);
    }
}

// Tăng độ khó theo thời gian
function increaseDifficulty() {
    setInterval(() => {
        laserSpeed += 0.5;
        spawnInterval = Math.max(500, spawnInterval - 100);
    }, difficultyIncreaseRate);
}

// Game Loop
function gameLoop() {
    movePlayer();
    moveLasers();
    requestAnimationFrame(gameLoop);
}

// Bắt đầu game
function startGame() {
    setInterval(spawnLaser, spawnInterval);
    increaseDifficulty();
    gameLoop();
}

startGame();