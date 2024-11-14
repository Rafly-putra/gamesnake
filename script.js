const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const boxSize = 20;
let snake, direction, food, score;
let gameSpeed = 200;
let game;

// Variabel untuk menyimpan skor tertinggi
let highScore = localStorage.getItem("highScore") || 0;

// Ambil elemen-elemen baru
const speedDropdown = document.getElementById("speed");
const startMenu = document.getElementById("startMenu");
const gameContainer = document.getElementById("gameContainer");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const scoreDisplay = document.getElementById("scoreDisplay");

// Tampilkan skor tertinggi saat halaman dimuat
document.getElementById("highScoreDisplay").textContent = highScore;

// Fungsi untuk menginisialisasi atau mengulang permainan
function initGame() {
    snake = [{ x: boxSize * 5, y: boxSize * 5 }];
    direction = "RIGHT";
    score = 0;
    scoreDisplay.textContent = score;
    
    food = {
        x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
    };
}

// Fungsi untuk memulai permainan
function startGame() {
    initGame();
    
    // Menentukan kecepatan berdasarkan pilihan
    if (speedDropdown.value === "low") {
        gameSpeed = 300;
    } else if (speedDropdown.value === "normal") {
        gameSpeed = 200;
    } else if (speedDropdown.value === "high") {
        gameSpeed = 100;
    }

    // Menampilkan game dan menyembunyikan menu awal
    startMenu.style.display = "none";
    gameContainer.style.display = "block";
    restartButton.style.display = "none";

    // Mulai interval game
    clearInterval(game);
    game = setInterval(draw, gameSpeed);
}

// Fungsi untuk menggambar game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Menggambar ular
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            ctx.fillStyle = "#4CAF50";
            ctx.beginPath();
            ctx.arc(snake[i].x + boxSize / 2, snake[i].y + boxSize / 2, boxSize / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = "#32CD32";
            ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
            ctx.strokeStyle = "black";
            ctx.strokeRect(snake[i].x, snake[i].y, boxSize, boxSize);
        }
    }

    // Menggambar makanan
    ctx.beginPath();
    ctx.arc(food.x + boxSize / 2, food.y + boxSize / 2, boxSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "UP") snakeY -= boxSize;
    if (direction === "DOWN") snakeY += boxSize;
    if (direction === "LEFT") snakeX -= boxSize;
    if (direction === "RIGHT") snakeX += boxSize;

    // Cek apakah ular makan makanan
    if (snakeX === food.x && snakeY === food.y) {
        food = {
            x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
            y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
        };
        score++;
        scoreDisplay.textContent = score; 
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Cek apakah ular menabrak dinding atau tubuhnya
    if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvas.width ||
        snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        
        // Cek dan perbarui skor tertinggi jika perlu
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore); // Simpan skor tertinggi ke localStorage
        }
        
        // Tampilkan skor dan skor tertinggi setelah game over
        alert("Game Over! Your score: " + score + ". High Score: " + highScore);
        document.getElementById("highScoreDisplay").textContent = highScore;
        restartButton.style.display = "block";
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Fungsi untuk mereset permainan
function resetGame() {
    startMenu.style.display = "block";
    gameContainer.style.display = "none";
    clearInterval(game);
}

// Event listeners
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", resetGame);