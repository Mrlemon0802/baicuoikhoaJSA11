const gameArea = document.getElementById("game-area");
const player = document.getElementById("player");

let playerX = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
let playerY = gameArea.offsetHeight - player.offsetHeight;
let speed = 5;
let dashDistance = 120;
let isDashing = false;
let isInvulnerable = false;
let lives = 4;
let lasers = [];
let laserSpeed = 3;
let spawnInterval = 2000;
let difficultyIncreaseRate = 5000;
let gameActive = true;

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

let keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

// Lướt
function dash() {
    if (isDashing || isInvulnerable || !gameActive) return;

    isDashing = true;
    isInvulnerable = true;

    const directionX = (keys["ArrowRight"] ? 1 : 0) - (keys["ArrowLeft"] ? 1 : 0);
    const directionY = (keys["ArrowDown"] ? 1 : 0) - (keys["ArrowUp"] ? 1 : 0);

    const dashX = directionX * dashDistance;
    const dashY = directionY * dashDistance;

    const targetX = Math.max(
        0,
        Math.min(gameArea.offsetWidth - player.offsetWidth, playerX + dashX)
    );
    const targetY = Math.max(
        0,
        Math.min(gameArea.offsetHeight - player.offsetHeight, playerY + dashY)
    );

    playerX = targetX;
    playerY = targetY;
    updatePlayerPosition();

    player.style.opacity = "0.5";
    setTimeout(() => {
        isDashing = false;
        player.style.opacity = "1";

        setTimeout(() => {
            isInvulnerable = false;
        }, 300);
    }, 0);
}

function movePlayer() {
    if (gameActive && !isDashing) {
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

    if (keys[" "]) dash();

    updatePlayerPosition();
}

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function loseLife() {
    if (isInvulnerable || lives <= 0 || !gameActive) return;

    lives--;
    if (bodyParts[lives]) {
        bodyParts[lives].classList.add("hidden");
    }

    if (lives === 0) {
        gameActive = false;
        alert("Game Over!");
        clearInterval(spawnIntervalID);
    }
}

// Tạo laser
function spawnLaser() {
    if (!gameActive) return;

    const laserType = Math.random() < 0.5 ? "long" : "short";
    const laser = document.createElement("div");
    laser.classList.add(laserType === "long" ? "long-laser" : "short-laser");

    // Vị trí và hướng xuất hiện ngẫu nhiên
    const randomEdge = Math.floor(Math.random() * 4); // 0: trên, 1: dưới, 2: trái, 3: phải
    let startX, startY, directionX, directionY, angle;

    switch (randomEdge) {
        case 0: // Trên
            startX = Math.random() * gameArea.offsetWidth;
            startY = 0;
            directionX = 0;
            directionY = 1;
            break;
        case 1: // Dưới
            startX = Math.random() * gameArea.offsetWidth;
            startY = gameArea.offsetHeight;
            directionX = 0;
            directionY = -1;
            break;
        case 2: // Trái
            startX = 0;
            startY = Math.random() * gameArea.offsetHeight;
            directionX = 1;
            directionY = 0;
            break;
        case 3: // Phải
            startX = gameArea.offsetWidth;
            startY = Math.random() * gameArea.offsetHeight;
            directionX = -1;
            directionY = 0;
            break;
    }

    laser.style.left = `${startX}px`;
    laser.style.top = `${startY}px`;
    gameArea.appendChild(laser);

    if (laserType === "long") {
        // Laser dài sẽ kéo dài hết chiều dài của game-area
        const laserWidth = 5; // Chiều rộng của laser dài
        let laserHeight = gameArea.offsetHeight; // Chiều dài laser khi đi từ trên xuống dưới
        if (randomEdge === 2 || randomEdge === 3) {
            laserHeight = gameArea.offsetWidth; // Chiều dài laser khi đi từ trái sang phải
            laser.style.transform = "rotate(90deg)"; // Xoay laser cho đúng hướng
        }

        laser.style.width = `${laserWidth}px`; // Đặt chiều rộng
        laser.style.height = `${laserHeight}px`; // Đặt chiều dài
        laser.style.opacity = "0"; // Đặt độ mờ ban đầu

        // Tạo hiệu ứng nhấp nháy
        setTimeout(() => {
            laser.style.transition = "opacity 0.3s ease-out";
            laser.style.opacity = "0.8"; // Làm laser sáng lên
        }, 100);

        // Làm laser dài biến mất sau 1s
        setTimeout(() => {
            laser.remove();
        }, 1000);
    } else {
        // Laser ngắn di chuyển trong game và có thể xoay các góc khác nhau
        const rotationAngle = Math.random() * 360; // Góc xoay ngẫu nhiên từ 0 đến 360 độ
        laser.style.transform = `rotate(${rotationAngle}deg)`; // Xoay laser ngắn một góc ngẫu nhiên
        lasers.push({ element: laser, directionX, directionY, angle: rotationAngle });
    }
}

function moveLasers() {
    lasers.forEach((laserData, index) => {
        const laser = laserData.element;
        const laserTop = parseInt(laser.style.top);
        const laserLeft = parseInt(laser.style.left);

        const newTop = laserTop + laserData.directionY * laserSpeed;
        const newLeft = laserLeft + laserData.directionX * laserSpeed;

        if (
            newTop < 0 ||
            newTop > gameArea.offsetHeight ||
            newLeft < 0 ||
            newLeft > gameArea.offsetWidth
        ) {
            laser.remove();
            lasers.splice(index, 1);
        } else {
            laser.style.top = `${newTop}px`;
            laser.style.left = `${newLeft}px`;
        }

        // Xoay laser ngắn theo hướng di chuyển
        if (laserData.angle !== undefined) {
            const angle = Math.atan2(laserData.directionY, laserData.directionX) * (180 / Math.PI);
            laser.style.transform = `rotate(${angle}deg)`; // Xoay laser ngắn theo hướng di chuyển
        }

        checkCollision(laser);
    });
}


function checkCollision(laser) {
    if (isInvulnerable || !gameActive) return;

    const laserRect = laser.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
        laserRect.left < playerRect.right &&
        laserRect.right > playerRect.left &&
        laserRect.top < playerRect.bottom &&
        laserRect.bottom > playerRect.top
    ) {
        loseLife();
        laser.remove();
    }
}




function increaseDifficulty() {
    setInterval(() => {
        if (!gameActive) return;

        laserSpeed += 0.5;
        spawnInterval = Math.max(500, spawnInterval - 100);
    }, difficultyIncreaseRate);
}

function gameLoop() {
    movePlayer();
    moveLasers();
    if (gameActive) requestAnimationFrame(gameLoop);
}

let spawnIntervalID;

function startGame() {
    spawnIntervalID = setInterval(spawnLaser, spawnInterval);
    increaseDifficulty();
    gameLoop();
}

startGame();