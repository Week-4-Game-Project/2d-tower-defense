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
    this.shadowColor = "green";
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
    ctx.shadowColor = this.shadowColor;
    ctx.shadowBlur = 15;

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
    ctx.shadowColor = "";
    ctx.shadowBlur = 0;
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