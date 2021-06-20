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
    ctx.font = "30px arial";
    ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 30); // Display health
  }
}
canvas.addEventListener("click", function () {
  const gridPositionX = mouse.x - (mouse.x % cellSize);
  const gridPositionY = mouse.y - (mouse.y % cellSize);
  if (gridPositionY < cellSize) return; // Prevent defender being placed on controlsBar
  for(let i = 0; i < defenders.length; i++){
    if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) // Prevent placing defenders on the same cell
    return;
  }
  let defenderCost = 100; // Resource cost of each defender
  if (numberOfResources >= defenderCost){
    defenders.push(new Defender(gridPositionX, gridPositionY)); // If resources > cost, place defender at mouse location
    numberOfResources -= defenderCost; // Pay resources
  }
});
// Draw defenders array on game board
function handleDefenders(){
  for (let i = 0; i < defenders.length; i++){
    defenders[i].draw();
  }
}

// ENEMIES

// RESOURCES

// UTILITIES
// Draw game status on game bar (resources, defenders, etc)
function handleGameStatus(){
  fillStyle = 'gold';
  ctx.font = '30px Arial';
  ctx.fillText('Resources: ' + numberOfResources, 20 , 55);
}

// Animation loop (basically a digital flipbook)
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
  handleGameGrid();
  handleDefenders();
  handleGameStatus();
  requestAnimationFrame(animate); //Callback function calls itself to loop through itself
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
