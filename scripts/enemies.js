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
    if (this.enemyType === enemy1 || enemy2) {
      this.maxFrame = 7;
    } else if (this.enemyType === enemy3) {
      this.maxFrame = 15;
    }
    this.spriteWidth = 130;
    this.spriteHeight = 130;
    //this.shadowColor = "green";
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
    // ctx.shadowColor = this.shadowColor;
    // ctx.shadowBlur = 15;

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
    // ctx.shadowColor = "";
    // ctx.shadowBlur = 0;
  }
}
