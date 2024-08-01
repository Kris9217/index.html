// Sélectionne l'élément canvas et son contexte de rendu 2D
const canvas = document.getElementById("breakoutCanvas");
const ctx = canvas.getContext("2d");

// Dimensions du canvas
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

// Propriétés de la balle
const ballRadius = 10;
let ballX, ballY;
let ballSpeedX = 2;
let ballSpeedY = -2;
let ballColor = "#ff6b6b";

// Propriétés de la raquette
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX;
let paddleColor = "#6bffb3";
const paddleSpeed = 7;

// Propriétés des briques
const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 50;
const brickHeight = 20;
const brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];

// Score du joueur
let score = 0;

// Vie du joueur
let lives = 3;

// Etat du jeu
let gameOver = false; // Indique si le jeu est terminé

// Chargement des sons
function playSound(sound) {
  sound.play().catch(error => console.error("Erreur lors de la lecture du son :", error));
}

const hitSound = new Audio('assets/sounds/hit.wav');
const loseLifeSound = new Audio('assets/sounds/lose_life.wav');
const gameOverSound = new Audio('assets/sounds/game_over.wav');
const backgroundMusic = new Audio('assets/sounds/background_music.wav');

hitSound.volume = 1.0; // Max volume
loseLifeSound.volume = 1.0;
gameOverSound.volume = 0.5;
backgroundMusic.volume = 1.0; // Volume modéré pour la musique de fond

// Erreurs de son
hitSound.onerror = () => console.error("Erreur de chargement du son hitSound");
loseLifeSound.onerror = () => console.error("Erreur de chargement du son loseLifeSound");
gameOverSound.onerror = () => console.error("Erreur de chargement du son gameOverSound");
backgroundMusic.onerror = () => console.error("Erreur de chargement du son backgroundMusic");

// Ajuste la taille du canvas à la taille de la fenêtre
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9; // 90% de la largeur de la fenêtre
  canvas.height = window.innerHeight * 0.6; // 60% de la hauteur de la fenêtre

  // Recalcule les dimensions du jeu après redimensionnement
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  ballX = canvasWidth / 2;
  ballY = canvasHeight - 30;
  paddleX = (canvasWidth - paddleWidth) / 2;
  paddleHeight = canvasHeight * 0.03; // Ajuste la hauteur de la raquette en fonction de la hauteur du canvas
  paddleWidth = canvasWidth * 0.2; // Ajuste la largeur de la raquette en fonction de la largeur du canvas

  // Calcule les nouvelles positions des briques
  const totalBrickWidth = brickColumnCount * (brickWidth + brickPadding) - brickPadding;
  const totalBrickHeight = brickRowCount * (brickHeight + brickPadding) - brickPadding;
  brickOffsetLeft = (canvasWidth - totalBrickWidth) / 2;
  brickOffsetTop = (canvasHeight - totalBrickHeight) / 2;

  // Positionne les boutons directionnels
  const buttonWidth = 80;
  const buttonHeight = 80;
  const buttonMargin = 10;
  const directionalButtons = document.querySelector(".directional-buttons");
  directionalButtons.style.left = `${buttonMargin}px`;
  directionalButtons.style.right = `${buttonMargin}px`;
  directionalButtons.style.bottom = `${buttonMargin}px`;
}

// Initialise le jeu
function init() {
  resizeCanvas(); // Réajuste la taille du canvas
  ballSpeedX = 2;
  ballSpeedY = -2;
  score = 0;
  lives = 3;
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1, color: getRandomColor() };
    }
  }
  gameOver = false; // Réinitialise l'état du jeu
}

// Génère une couleur aléatoire pour les briques
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Dessine la balle
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

// Dessine la raquette
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = paddleColor;
  ctx.fill();
  ctx.closePath();
}

// Dessine les briques
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Dessine le score
function drawScore() {
  ctx.font = "16px Arial"; // Définit la taille de la police
  ctx.fillStyle = "#fff";  // Définit la couleur du texte (blanc)
  ctx.textAlign = "left";  // Aligne le texte à gauche
  ctx.fillText("Score: " + score, 8, 20); // Affiche le score
}

// Dessine les vies restantes
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "right";
  ctx.fillText("Vies: " + lives, canvasWidth - 8, 20);
}

// Vérifie les collisions entre la balle et les briques
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          ballX > b.x &&
          ballX < b.x + brickWidth &&
          ballY > b.y &&
          ballY < b.y + brickHeight
        ) {
          ballSpeedY = -ballSpeedY;
          b.status = 0;
          score += 10;
          playSound(hitSound); // Joue le son de collision
          if (score === brickRowCount * brickColumnCount * 10) {
            endGame("Gagné", "Félicitations ! Vous avez gagné.");
          }
        }
      }
    }
  }
}

// Met à jour les positions de la balle et de la raquette, vérifie les collisions
function update() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Vérifie les collisions avec les bords du canvas
  if (ballX + ballSpeedX > canvasWidth - ballRadius || ballX + ballSpeedX < ballRadius) {
    ballSpeedX = -ballSpeedX;
    playSound(hitSound); // Joue le son de collision
  }
  if (ballY + ballSpeedY < ballRadius) {
    ballSpeedY = -ballSpeedY;
    playSound(hitSound); // Joue le son de collision
  } else if (ballY + ballRadius > canvasHeight) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballSpeedY = -ballSpeedY;
    } else {
      lives--;
      playSound(loseLifeSound); // Joue le son de perte de vie
      if (lives < 0) {
        endGame("Perdu", "Jeu terminé. Vous avez perdu.");
      } else {
        // Réinitialise la balle sans augmenter la vitesse
        ballX = canvasWidth / 2;
        ballY = canvasHeight - 30;
        ballSpeedX = 2;
        ballSpeedY = -2;
        paddleX = (canvasWidth - paddleWidth) / 2;
      }
    }
  }

  collisionDetection();

  if (rightPressed && paddleX < canvasWidth - paddleWidth) {
    paddleX += paddleSpeed;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed;
  }
}

// Gère les boutons directionnels
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

let rightPressed = false;
let leftPressed = false;

// Écoute les événements de touche pressée
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.code === "ArrowRight") {
    rightPressed = true;
  } else if (e.code === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.code === "ArrowRight") {
    rightPressed = false;
  } else if (e.code === "ArrowLeft") {
    leftPressed = false;
  }
}

// Gère les événements de clic sur les boutons directionnels
leftButton.addEventListener('touchstart', () => {
  leftPressed = true;
  rightPressed = false;
});

rightButton.addEventListener('touchstart', () => {
  rightPressed = true;
  leftPressed = false;
});

document.addEventListener('touchend', () => {
  leftPressed = false;
  rightPressed = false;
});

// Réinitialise le jeu en rechargeant la page
function resetGame() {
  location.reload(); // Recharge la page pour réinitialiser le jeu
}

// Fonction de fin de jeu
function endGame(result, message) {
  if (gameOver) return; // Empêche la fonction de se déclencher plusieurs fois
  gameOver = true;

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  playSound(gameOverSound); // Joue le son de fin de jeu

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  ctx.font = "24px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(message, canvasWidth / 2, canvasHeight / 2);
  ctx.font = "18px Arial";
  ctx.fillText("Score final: " + score, canvasWidth / 2, canvasHeight / 2 + 30);

  setTimeout(() => {
    const choice = confirm("Voulez-vous recommencer ? Cliquez sur 'OK' pour recommencer ou 'Annuler' pour quitter.");
    if (choice) {
      resetGame(); // Réinitialise le jeu et redémarre
    } else {
      window.location.href = "index.html"; // Redirige vers la page d'accueil
    }
  }, 2000); // Affiche le message pendant 2 secondes avant de demander de recommencer ou quitter
}

// Fonction de dessin principal
function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Efface le canvas
  drawBricks();                                   // Dessine les briques
  drawBall();                                     // Dessine la balle
  drawPaddle();                                   // Dessine la raquette
  drawScore();                                    // Affiche le score
  drawLives();                                    // Affiche les vies restantes
  update();                                       // Met à jour les positions et vérifie les collisions

  requestAnimationFrame(draw);                    // Redessine le canvas pour la prochaine frame
}

// Démarre le jeu lorsque le bouton est cliqué
document.getElementById("startGame").addEventListener("click", () => {
  console.log("Bouton démarrer cliqué");
  document.getElementById("startGame").style.display = "none";
  backgroundMusic.play().catch(error => console.error("Erreur lors de la lecture de la musique de fond :", error));
  init(); // Initialise le jeu après avoir commencé la musique
  draw(); // Démarre le dessin du jeu
});

// Appelle resizeCanvas lors du redimensionnement de la fenêtre
window.addEventListener('resize', resizeCanvas);
