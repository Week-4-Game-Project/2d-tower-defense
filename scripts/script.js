const canvas = document.getElementById("canvas"); //Connects this file to the index.html <canvas> element
const ctx = canvas.getContext("2d"); //Calls canvas 2d context methods
canvas.width = 900;
canvas.height = 600;

// GLOBAL VARIABLES
const cellSize = 100; // Size of each game board cell
const cellGap = 3; // Gap between cells
const gameGrid = []; // Array of game cells
const defenders = []; // Array of defenders on game board
let numberOfResources = 300;
const enemies = [];
const enemyPositions = [];
let enemiesInterval = 600; // Enemy spawn interval
let frame = 0;
let gameOver = false;

// mouse
const mouse = {
  x: 10,
  y: 10,
  width: 0.1,
  height: 0.1,
};
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

// DEFENDERS
class Defender {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellSize;
    this.height = cellSize;
    this.shooting = false; // Is there an enemy in my row?
    this.health = 100;
    this.projectiles = []; // Projectiles I am currently shooting
    this.timer = 0; // Periodically trigger defender actions
  }
  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "gold";
    ctx.font = "30px Orbitron";
    ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 30); // Display health
  }
}
canvas.addEventListener("click", function () {
  const gridPositionX = mouse.x - (mouse.x % cellSize);
  const gridPositionY = mouse.y - (mouse.y % cellSize);
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
  }
});
// Draw defenders array on game board
function handleDefenders() {
  for (let i = 0; i < defenders.length; i++) {
    defenders[i].draw();
    // Check collision between defender and enemies
    for (let j = 0; j < enemies.length; j++){
      if (collision(defenders[i], enemies[j])){
        enemies[j].movement = 0;
        defenders[i].health -= 0.2;
      }
       // If defender health less than 0, remove defender
      if (defenders[i] && defenders[i].health<=0) {
        defenders.splice(i,1);
        i--;
        enemies[j].movement = enemies[j].speed;
      }
    }
  }
}

// ENEMIES
class Enemy {
  constructor(verticalPosition) {
    this.x = canvas.width;
    this.y = verticalPosition;
    this.with = cellSize;
    this.height = cellSize;
    this.speed = Math.random() * 0.2 + 0.4;
    this.movement = this.speed;
    this.health = 100;
    this.maxHealth = this.health;
  }
  // Moves enemy slowly to the left
  update() {
    this.x -= this.movement;
  }
  draw() {
    ctx.fillStyle = "red"; // Draw enemy box
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "black"; // Draws enemy health points
    ctx.font = "30px Orbitron";
    ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 30); // Display health
  }
}
// Draws enemies array one time
function handleEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update();
    enemies[i].draw();
    if (enemies[i].x < 0){
      gameOver = true;
  }
  }
  if (frame % enemiesInterval === 0) {
    let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize;
    enemies.push(new Enemy(verticalPosition, verticalPosition));
    enemyPositions.push(verticalPosition);
    if (enemiesInterval > 120) enemiesInterval -= 50;
  }
}

// RESOURCES

// UTILITIES
// Draw game status on game bar (resources, defenders, etc)
function handleGameStatus() {
  fillStyle = "gold";
  ctx.font = "30px Orbitron";
  ctx.fillText("Resources: " + numberOfResources, 20, 55);
   if (gameOver){
        ctx.fillStyle = 'black';
        ctx.font = '90px Orbitron';
        ctx.fillText('GAME OVER', 135, 330);
   }
}

// Animation loop (basically a digital flipbook)
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
  handleGameGrid();
  handleDefenders();
  handleEnemies();
  handleGameStatus();
  frame++;
  if (!gameOver) requestAnimationFrame(animate); //Callback function calls itself to loop through itself
}
animate();

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
