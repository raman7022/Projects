
"use strict";

// ========================================
// TEMPLE RUNNER GAME
// ========================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const coinsEl = document.getElementById("coins");
const bestEl = document.getElementById("best");

const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayMessage = document.getElementById("overlayMessage");
const startBtn = document.getElementById("startBtn");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");
const slideBtn = document.getElementById("slideBtn");

const W = canvas.width;
const H = canvas.height;

let running = false;
let animationId = null;
let lastTime = 0;

let score = 0;
let coins = 0;
let best = 0;
let speed = 260;

let lane = 1;
let objects = [];

let spawnTimer = 0;
let roadOffset = 0;

let jumpTimer = 0;
let slideTimer = 0;

const playerY = 485;

// ========================================
// BACKGROUND
// ========================================

function drawBackground() {
    const sky = ctx.createLinearGradient(0, 0, 0, H);

    sky.addColorStop(0, "#75a85a");
    sky.addColorStop(1, "#244d2c");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Jungle trees
    for (let i = 0; i < 22; i++) {
        const x = (i * 137) % W;
        const y = 70 + (i * 73) % 270;

        ctx.fillStyle = "#163d23";
        ctx.beginPath();
        ctx.arc(x, y, 35, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#34723b";
        ctx.beginPath();
        ctx.arc(x + 10, y - 12, 22, 0, Math.PI * 2);
        ctx.fill();
    }

    // Temple
    ctx.fillStyle = "#b18b52";
    ctx.fillRect(380, 100, 140, 65);

    ctx.fillStyle = "#d4ae70";
    ctx.beginPath();
    ctx.moveTo(365, 100);
    ctx.lineTo(450, 35);
    ctx.lineTo(535, 100);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#49351f";
    ctx.fillRect(430, 125, 40, 40);
}

// ========================================
// ROAD
// ========================================

function laneX(n, y) {
    const perspective = (y - 130) / 470;
    const spacing = 28 + perspective * 105;

    return 450 + (n - 1) * spacing;
}

function drawRoad() {
    ctx.fillStyle = "#625b50";

    ctx.beginPath();
    ctx.moveTo(400, 130);
    ctx.lineTo(500, 130);
    ctx.lineTo(800, 600);
    ctx.lineTo(100, 600);
    ctx.closePath();
    ctx.fill();

    // Road edges
    ctx.strokeStyle = "#e9c77a";
    ctx.lineWidth = 7;

    ctx.beginPath();
    ctx.moveTo(400, 130);
    ctx.lineTo(100, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(500, 130);
    ctx.lineTo(800, 600);
    ctx.stroke();

    // Lane separators
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 30]);
    ctx.lineDashOffset = -roadOffset;

    ctx.beginPath();
    ctx.moveTo(427, 130);
    ctx.lineTo(350, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(473, 130);
    ctx.lineTo(550, 600);
    ctx.stroke();

    ctx.setLineDash([]);
}

// ========================================
// PLAYER
// ========================================

function drawPlayer() {
    const x = laneX(lane, playerY);

    let lift = 0;

    if (jumpTimer > 0) {
        lift = Math.sin(
            (1 - jumpTimer / 0.8) * Math.PI
        ) * 125;
    }

    const y = playerY - lift;
    const sliding = slideTimer > 0;

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(
        x, playerY + 23, 26, 9, 0, 0, Math.PI * 2
    );
    ctx.fill();

    // Body
    ctx.fillStyle = "#e94328";

    if (sliding) {
        ctx.fillRect(x - 28, y + 7, 55, 20);
    } else {
        ctx.fillRect(x - 17, y - 10, 34, 40);
    }

    // Head
    ctx.fillStyle = "#ffcc99";
    ctx.beginPath();

    if (sliding) {
        ctx.arc(x + 22, y + 7, 13, 0, Math.PI * 2);
    } else {
        ctx.arc(x, y - 25, 16, 0, Math.PI * 2);
    }

    ctx.fill();

    // Hair
    ctx.fillStyle = "#382316";
    ctx.beginPath();

    if (sliding) {
        ctx.arc(x + 22, y + 3, 13, Math.PI, Math.PI * 2);
    } else {
        ctx.arc(x, y - 31, 15, Math.PI, Math.PI * 2);
    }

    ctx.fill();

    // Legs
    ctx.strokeStyle = "#17212b";
    ctx.lineWidth = 7;
    ctx.beginPath();

    if (sliding) {
        ctx.moveTo(x - 20, y + 23);
        ctx.lineTo(x - 35, y + 28);
        ctx.moveTo(x + 5, y + 23);
        ctx.lineTo(x - 5, y + 28);
    } else {
        ctx.moveTo(x - 8, y + 29);
        ctx.lineTo(x - 13, y + 45);
        ctx.moveTo(x + 8, y + 29);
        ctx.lineTo(x + 13, y + 45);
    }

    ctx.stroke();
}

// ========================================
// OBJECTS
// ========================================

function spawnObject() {
    const random = Math.random();

    let type;

    if (random < 0.38) {
        type = "coin";
    } else if (random < 0.68) {
        type = "rock";
    } else if (random < 0.85) {
        type = "box";
    } else {
        type = "barrier";
    }

    objects.push({
        lane: Math.floor(Math.random() * 3),
        y: 145,
        type,
        collected: false
    });
}

function drawObjects() {
    objects.forEach(obj => {
        const x = laneX(obj.lane, obj.y);
        const size = 18 + obj.y * 0.065;

        if (obj.type === "coin") {
            ctx.fillStyle = "#ffd700";
            ctx.beginPath();
            ctx.arc(x, obj.y, size / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "#fff5ad";
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.fillStyle = "#a46b00";
            ctx.font = "bold 18px Arial";
            ctx.textAlign = "center";
            ctx.fillText("$", x, obj.y + 6);

        } else if (obj.type === "barrier") {
            // Low barrier: jump over it
            ctx.fillStyle = "#a52a2a";
            ctx.fillRect(
                x - size / 2,
                obj.y - size / 3,
                size,
                size / 2
            );

            ctx.fillStyle = "#ffdb65";
            ctx.fillRect(
                x - size / 2,
                obj.y - size / 3,
                size,
                7
            );

        } else {
            ctx.fillStyle =
                obj.type === "rock" ? "#888888" : "#a85b27";

            ctx.fillRect(
                x - size / 2,
                obj.y - size / 2,
                size,
                size
            );

            ctx.strokeStyle = "#39291d";
            ctx.lineWidth = 3;

            ctx.strokeRect(
                x - size / 2,
                obj.y - size / 2,
                size,
                size
            );
        }
    });
}

// ========================================
// CONTROLS
// ========================================

function moveLeft() {
    if (running && lane > 0) {
        lane--;
    }
}

function moveRight() {
    if (running && lane < 2) {
        lane++;
    }
}

function jump() {
    if (running && jumpTimer <= 0 && slideTimer <= 0) {
        jumpTimer = 0.8;
    }
}

function slide() {
    if (running && slideTimer <= 0 && jumpTimer <= 0) {
        slideTimer = 0.65;
    }
}

// ========================================
// COLLISIONS
// ========================================

function checkCollision() {
    const remaining = [];

    for (const obj of objects) {
        const sameLane = obj.lane === lane;
        const close = obj.y > 450 && obj.y < 530;

        if (sameLane && close) {
            if (obj.type === "coin") {
                coins++;
                coinsEl.textContent = coins;
                continue;
            }

            let safe = false;

            if (obj.type === "barrier") {
                safe = jumpTimer > 0.15;
            } else if (obj.type === "box") {
                safe = jumpTimer > 0.15;
            } else if (obj.type === "rock") {
                safe = slideTimer > 0.1 || jumpTimer > 0.15;
            }

            if (!safe) {
                endGame();
                return;
            }
        }

        if (obj.y < 630) {
            remaining.push(obj);
        }
    }

    objects = remaining;
}

// ========================================
// DRAW GAME
// ========================================

function drawGame() {
    ctx.clearRect(0, 0, W, H);

    drawBackground();
    drawRoad();
    drawObjects();
    drawPlayer();
}

// ========================================
// UPDATE GAME
// ========================================

function update(delta) {
    score += delta * 10;

    speed = Math.min(260 + score * 0.8, 600);

    roadOffset = (roadOffset + speed * delta) % 60;

    spawnTimer += delta;

    const interval = Math.max(
        0.65,
        1.25 - score / 1800
    );

    if (spawnTimer >= interval) {
        spawnObject();
        spawnTimer = 0;
    }

    if (jumpTimer > 0) {
        jumpTimer = Math.max(0, jumpTimer - delta);
    }

    if (slideTimer > 0) {
        slideTimer = Math.max(0, slideTimer - delta);
    }

    objects.forEach(obj => {
        obj.y += speed * delta;
    });

    checkCollision();

    scoreEl.textContent = Math.floor(score);
}

// ========================================
// GAME LOOP
// ========================================

function gameLoop(time) {
    if (!running) {
        animationId = null;
        return;
    }

    const delta = Math.min(
        (time - lastTime) / 1000,
        0.04
    );

    lastTime = time;

    update(delta);

    if (!running) {
        animationId = null;
        drawGame();
        return;
    }

    drawGame();

    animationId = requestAnimationFrame(gameLoop);
}

// ========================================
// START GAME
// ========================================

function startGame() {
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    score = 0;
    coins = 0;
    speed = 260;

    lane = 1;
    objects = [];

    spawnTimer = 0;
    roadOffset = 0;

    jumpTimer = 0;
    slideTimer = 0;

    scoreEl.textContent = "0";
    coinsEl.textContent = "0";

    overlay.style.display = "none";

    running = true;

    drawGame();

    lastTime = performance.now();

    animationId = requestAnimationFrame(gameLoop);
}

// ========================================
// GAME OVER
// ========================================

function endGame() {
    if (!running) return;

    running = false;

    const finalScore = Math.floor(score);

    if (finalScore > best) {
        best = finalScore;
        bestEl.textContent = best;
    }

    overlayTitle.textContent = "GAME OVER!";
    overlayMessage.textContent =
        "Score: " + finalScore +
        " | Coins: " + coins;

    startBtn.textContent = "PLAY AGAIN";

    overlay.style.display = "flex";
}

// ========================================
// KEYBOARD
// ========================================

document.addEventListener("keydown", event => {
    const keys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Space"
    ];

    if (keys.includes(event.code)) {
        event.preventDefault();
    }

    if (event.repeat) return;

    switch (event.code) {
        case "ArrowLeft":
        case "KeyA":
            moveLeft();
            break;

        case "ArrowRight":
        case "KeyD":
            moveRight();
            break;

        case "ArrowUp":
        case "KeyW":
        case "Space":
            jump();
            break;

        case "ArrowDown":
        case "KeyS":
            slide();
            break;
    }
});

// ========================================
// BUTTON CONTROLS
// ========================================

leftBtn.addEventListener("click", moveLeft);
rightBtn.addEventListener("click", moveRight);
jumpBtn.addEventListener("click", jump);
slideBtn.addEventListener("click", slide);

startBtn.addEventListener("click", startGame);

// ========================================
// SWIPE CONTROLS
// ========================================

let touchX = 0;
let touchY = 0;

canvas.addEventListener("touchstart", event => {
    touchX = event.changedTouches[0].clientX;
    touchY = event.changedTouches[0].clientY;
}, { passive: true });

canvas.addEventListener("touchend", event => {
    const dx = event.changedTouches[0].clientX - touchX;
    const dy = event.changedTouches[0].clientY - touchY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) moveRight();
        if (dx < -30) moveLeft();
    } else {
        if (dy < -30) jump();
        if (dy > 30) slide();
    }
}, { passive: true });

// ========================================
// INITIALIZE
// ========================================

drawGame();

bestEl.textContent = best;

console.log("Temple Runner initialized successfully!");
