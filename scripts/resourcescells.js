// RESOURCES
const resourcesImg = new Image();
resourcesImg.src = "./images/acorn-resource-160px.png";
const amounts = [20, 30, 40];
class Resource {
  constructor() {
    this.x = Math.random() * (canvas.width - cellSize);
    this.y = (Math.floor(Math.random() * 5) + 1) * cellSize + 25;
    this.width = cellSize * 0.6;
    this.height = cellSize * 0.6;
    this.amount = amounts[Math.floor(Math.random() * amounts.length)];
    this.frameX = 0;
    this.frameY = 0;
    this.minFrame = 0;
    this.maxFrame = 3;
    this.spriteWidth = 136;
    this.spriteHeight = 34;
  }

  draw() {
    // ctx.fillStyle = "yellow";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.fillStyle = "black";
    // ctx.font = "20px Orbitron";
    // ctx.fillText(this.amount, this.x + 15, this.y + 25);
    ctx.drawImage(
      resourcesImg,
      // this.frameX * this.spriteWidth,
      // 0,
      // this.spriteWidth,
      // this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

function handleResources() {
  if (frame % resourceFrequency === 0 && score < winningScore) {
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
        new floatingMessage("+" + resources[i].amount, 250, 50, 30, "black")
      );
      resources.splice(i, 1);
      i--;
    }
  }
}

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
