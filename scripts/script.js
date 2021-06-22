const canvas = document.getElementById("canvas"); //Connects this file to the index.html <canvas> element
const ctx = canvas.getContext("2d"); //Calls canvas 2d context methods
canvas.width = 900;
canvas.height = 600;

// GLOBAL VARIABLES
const cellSize = 100; // Size of each game board cell
const cellGap = 3; // Gap between cells
let numberOfResources = 300;
let enemiesInterval = 600; // Enemy spawn interval
let frame = 0;
let gameOver = false;
let score = 0;
const winningScore = 200;
let chosenDefender = 1;

const gameGrid = []; // Array of game cells
const defenders = []; // Array of defenders on game board
const enemies = [];
const enemyPositions = [];
const projectiles = [];
const resources = [];

// mouse
const mouse = {
  x: 10,
  y: 10,
  width: 0.1,
  height: 0.1,
  clicked: false
};

canvas.addEventListener('mousedown', function(){
mouse.clicked = true;
});
canvas.addEventListener('mouseup', function(){
  mouse.clicked = false;
  
});

let canvasPosition = canvas.getBoundingClientRect(); // Gets info about position of canvas from top, right, bottom, and left, as well as canvas dimensions and it's starting x and y coordinates. Needed to adjust canvas coordinates as browser window is resized.
canvas.addEventListener("mousemove", function (event) {
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener("mouseleave", function () {
  // Sets mouse coords. as undefined when leave canvas
  mouse.x = undefined;
  mouse.y = undefined;
});

// GAME BOARD
// Blue bar on first row, all defenders, resources, and score displayed here
const controlsBar = {
  width: canvas.width,
  height: cellSize,
};
// Cell blueprint
class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellSize;
    this.height = cellSize;
  }
  draw() {
    if (mouse.x && mouse.y && collision(this, mouse)) {
      // Cell highlight on mouseover: If mouse x and y have coordinates (ie. not outside canvas), AND there is collision between THIS cell object and MOUSE, then draw() the cell outline
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}
// Function to populate gameGrid array with Cell objects.
function createGrid() {
  for (let y = cellSize; y < canvas.height; y += cellSize) {
    for (let x = 0; x < canvas.width; x += cellSize) {
      gameGrid.push(new Cell(x, y));
    }
  }
}
createGrid();
// Draws the board gridlines
function handleGameGrid() {
  for (let i = 0; i < gameGrid.length; i++) {
    gameGrid[i].draw();
  }
}

// PROJECTILES
class Projectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.power = 20;
    this.speed = 5;
  }
  update() {
    this.x += this.speed;
  }
  draw() {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
    ctx.fill();
  }
}
function handleProjectiles() {
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].update();
    projectiles[i].draw();

    // Loops through enemy array and detects collision with projectiles
    for (let j = 0; j < enemies.length; j++) {
      if (
        enemies[j] &&
        projectiles[i] &&
        collision(projectiles[i], enemies[j])
      ) {
        enemies[j].health -= projectiles[i].power; //Health removed enemy
        projectiles.splice(i, 1);
        i--;
      }
    }
    // Removes projectile when it exits canvas border
    if (projectiles[i] && projectiles[i].x > canvas.width - cellSize) {
      projectiles.splice(i, 1);
      i--;
    }
  }
}

const defender1 = new Image();
defender1.src = "../images/defender1.png";
// const defender2 = new Image();
// defender2.src = "../images/defender2.png";

// DEFENDERS
class Defender {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.shooting = false; // Is there an enemy in my row?
    this.shootNow = false;
    this.health = 100;
    this.projectiles = []; // Projectiles I am currently shooting
    this.timer = 0; // Periodically trigger defender actions
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 130;
    this.spriteHeight = 130;
    this.minFrame = 0;
    this.maxFrame = 23;
    this.chosenDefender = chosenDefender;
  }
  draw() {
    // ctx.fillStyle = "blue";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.fillStyle = "gold";
    // ctx.font = "30px Orbitron";
    // ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 30); // Display health
    if (this.chosenDefender === 1){
      ctx.drawImage(
        defender1,
        this.frameX * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else if (this.chosenDefender ===2){
      // CHANGE TO DEFENDER 2 ONCE SPRITE OBTAINED
      ctx.drawImage(
        defender1,
        this.frameX * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );

    }
  }
  update() {
    // Shooting speed
    if (frame % 5 === 0) {
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = this.minFrame;
      if (this.frameX === 10) this.shootNow = true;
    }
    // Synchronize shooting animation frames
    if (this.shooting) {
      this.minFrame = 0;
      this.maxFrame = 11;
    }
    // Synchronize idle frames
    else {
      this.minFrame = 12;
      this.maxFrame = 23;
    }
    // Make sure animation and projectile shoot at same time
    if (this.shooting && this.shootNow) {
      projectiles.push(new Projectile(this.x + 70, this.y + 45));
      this.shootNow = false;
    }
  }
}

// Draw defenders array on game board
function handleDefenders() {
  for (let i = 0; i < defenders.length; i++) {
    defenders[i].update();
    defenders[i].draw();

    // Check if enemy is present in row
    if (enemyPositions.indexOf(defenders[i].y) !== -1) {
      defenders[i].shooting = true;
    } else {
      defenders[i].shooting = false;
    }
    // Check collision between defender and enemies
    for (let j = 0; j < enemies.length; j++) {
      if (defenders[i] && collision(defenders[i], enemies[j])) {
        enemies[j].movement = 0;
        defenders[i].health -= 0.2;
      }
      // If defender health less than 0, remove defender
      if (defenders[i] && defenders[i].health <= 0) {
        defenders.splice(i, 1);
        i--;
        enemies[j].movement = enemies[j].speed;
      }
    }
  }
}

// Defender choice cards on gameBar
const card1 = {
  x: 10,
  y: 10,
  width: 70,
  height: 85,
};
const card2 = {
  x: 90,
  y: 10,
  width: 70,
  height: 85,
};

function chooseDefender() {
  let card1stroke = "black";
  let card2stroke = "black";
  if (collision(mouse, card1) && mouse.clicked) {
    chosenDefender = 1;
  } else if (collision(mouse, card2) && mouse.clicked) {
    chosenDefender = 2;
  }
  if (chosenDefender === 1) {
    card1stroke = "gold";
    card2stroke = "black";
  } else if (chosenDefender === 2) {
    card1stroke = "black";
    card2stroke = "gold";
  } else {
    card1stroke = "black";
    card2stroke = "black";
  }

  ctx.lineWidth = 1;
  ctx.fillStyle = "rgba(0, 0, 0,0.1)";
  ctx.fillRect(card1.x, card1.y, card1.width, card1.height);
  ctx.strokeStyle = card1stroke;
  ctx.strokeRect(card1.x, card1.y, card1.width, card1.height);
  ctx.drawImage(defender1, 0, 0, 130, 130, 0, 5, 130 / 2, 130 / 2);
  ctx.fillRect(card2.x, card2.y, card2.width, card2.height);
  ctx.drawImage(defender1, 0, 0, 130, 130, 0, 5, 130 / 2, 130 / 2); // CHANGE TO DEFENDER 2 WHEN IMAGE IS OBTAINED
  ctx.strokeStyle = card2stroke;
  ctx.strokeRect(card2.x, card2.y, card2.width, card2.height);
}

// FLOATING MESSAGES
const floatingMessages = [];
class floatingMessage {
  constructor(value, x, y, size, color) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.size = size;
    this.lifeSpan = 0;
    this.color = color;
    this.opacity = 1;
  }
  update() {
    this.y -= 0.3;
    this.lifeSpan += 1;
    if (this.opacity > 0.01) this.opacity -= 0.03;
  }
  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.font = this.size + "px Orbitron";
    ctx.fillText(this.value, this.x, this.y);
    ctx.globalAlpha = 1;
  }
}
function handleFloatingMessags() {
  for (let i = 0; i < floatingMessages.length; i++) {
    floatingMessages[i].update();
    floatingMessages[i].draw();
    if (floatingMessages[i].lifeSpan >= 50) {
      floatingMessages.splice(i, 1);
      i--;
    }
  }
}
const enemyTypes = [];
const enemy1 = new Image();
enemy1.src = "../images/enemy1.png";
enemyTypes.push(enemy1);

const enemy2 = new Image();
enemy2.src = "../images/enemy2.png";
enemyTypes.push(enemy2);

const enemy3 = new Image();
enemy3.src = "../images/enemy3.png";
enemyTypes.push(enemy3);

// ENEMIES
class Enemy {
  constructor(verticalPosition) {
    this.x = canvas.width;
    this.y = verticalPosition;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.speed = Math.random() * 0.2 + 0.4;
    this.movement = this.speed;
    this.health = 100;
    this.maxHealth = this.health;
    this.enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    this.frameX = 0;
    this.frameY = 0;
    this.minFrame = 0;
    this.maxFrame = 11;
    this.spriteWidth = 130;
    this.spriteHeight = 130;
  }
  // Moves enemy slowly to the left
  update() {
    this.x -= this.movement;
    if (frame % 10 === 0) {
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = this.minFrame;
    }
  }
  draw() {
    // ctx.fillStyle = "red"; // Draw enemy box
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    //ctx.fillStyle = "black"; // Draws enemy health points
    // ctx.font = "30px Orbitron";
    // ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 30); // Display health
    ctx.drawImage(
      this.enemyType,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
// Draws enemies array one time
function handleEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update();
    enemies[i].draw();
    if (enemies[i].x < 0) {
      gameOver = true;
    }
    if (enemies[i].health <= 0) {
      let gainedResources = enemies[i].maxHealth / 10; // Resources gained from killing enemy
      floatingMessages.push(
        new floatingMessage(
          "+" + gainedResources,
          enemies[i].x,
          enemies[i].y,
          30,
          "black"
        )
      );
      floatingMessages.push(
        new floatingMessage("+" + gainedResources, 250, 50, 30, "gold")
      );
      numberOfResources += gainedResources; // Gain resources based on enemy health
      score += gainedResources; //Same for score
      const findThisIndex = enemyPositions.indexOf(enemies[i].y);
      enemyPositions.splice(findThisIndex, 1);
      enemies.splice(i, 1);
      i--;
      console.log(enemyPositions);
    }
  }
  if (frame % enemiesInterval === 0 && score < winningScore) {
    let verticalPosition =
      Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
    enemies.push(new Enemy(verticalPosition, verticalPosition));
    enemyPositions.push(verticalPosition);
    if (enemiesInterval > 120) enemiesInterval -= 50;
  }
}

// RESOURCES
const amounts = [20, 30, 40];
class Resource {
  constructor() {
    this.x = Math.random() * (canvas.width - cellSize);
    this.y = (Math.floor(Math.random() * 5) + 1) * cellSize + 25;
    this.width = cellSize * 0.6;
    this.height = cellSize * 0.6;
    this.amount = amounts[Math.floor(Math.random() * amounts.length)];
  }
  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "black";
    ctx.font = "20px Orbitron";
    ctx.fillText(this.amount, this.x + 15, this.y + 25);
  }
}
function handleResources() {
  if (frame % 500 === 0 && score < winningScore) {
    resources.push(new Resource());
  }
  for (let i = 0; i < resources.length; i++) {
    resources[i].draw();
    if (resources[i] && mouse.x && mouse.y && collision(resources[i], mouse)) {
      numberOfResources += resources[i].amount;
      floatingMessages.push(
        new floatingMessage(
          "+" + resources[i].amount,
          resources[i].x,
          resources[i].y,
          30,
          "black"
        )
      );
      floatingMessages.push(
        new floatingMessage("+" + resources[i].amount, 250, 50, 30, "gold")
      );
      resources.splice(i, 1);
      i--;
    }
  }
}

// UTILITIES
// Draw game status on game bar (resources, defenders, etc)
function handleGameStatus() {
  fillStyle = "gold";
  ctx.font = "30px Orbitron";
  ctx.fillText("Score: " + score, 180, 40);
  ctx.fillText("Resources: " + numberOfResources, 180, 80);
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "90px Orbitron";
    ctx.fillText("GAME OVER", 135, 330);
  }
  if (score >= winningScore && enemies.length === 0) {
    ctx.fillStyle = "black";
    ctx.font = "60px Orbitron";
    ctx.fillText("LEVEL COMPLETE", 130, 300);
    ctx.font = "30px Orbitron";
    ctx.fillText("You win with " + score + " points!", 134, 340);
  }
}
// Defender summon on mouse click
canvas.addEventListener("click", function () {
  const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap;
  const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
  if (gridPositionY < cellSize) return; // Prevent defender being placed on controlsBar
  for (let i = 0; i < defenders.length; i++) {
    if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY)
      // Prevent placing defenders on the same cell
      return;
  }
  let defenderCost = 100; // Resource cost of each defender
  if (numberOfResources >= defenderCost) {
    defenders.push(new Defender(gridPositionX, gridPositionY)); // If resources > cost, place defender at mouse location
    numberOfResources -= defenderCost; // Pay resources
  } else {
    floatingMessages.push(
      new floatingMessage("need more resources", mouse.x, mouse.y, 20, "blue")
    );
  }
});
// Animation loop (basically a digital flipbook)
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1";
  ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
  handleGameGrid();
  handleDefenders();
  handleResources();
  handleProjectiles();
  handleEnemies();
  chooseDefender();
  handleGameStatus();
  handleFloatingMessags();
  frame++;
  if (!gameOver) requestAnimationFrame(animate); //Callback function calls itself to loop through itself
}

// Call animate function manually
function startGame() {
  console.log("startGame() function called!"); //debug
  animate();
}
// animate(); // Start game upon page load
//testcomment, delete please

// Start game using button
window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    console.log("Start button clicked!");
    startGame();
  };
};

// Collision detection function
function collision(first, second) {
  // If any of these comparisons return true, it means there is no collision. But we use the ! operator to say "if collision is false, execute following code. else, collision is true."
  if (
    !(
      first.x > second.x + second.width ||
      first.x + first.width < second.x ||
      first.y > second.y + second.height ||
      first.y + first.height < second.y
    )
  ) {
    return true;
  }
}

window.addEventListener("resize", function () {
  canvasPosition = canvas.getBoundingClientRect();
});
