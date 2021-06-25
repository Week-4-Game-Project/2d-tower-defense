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
    this.spriteWidth = 150;
    this.spriteHeight = 150;
    this.minFrame = 0;
    this.maxFrame = 25;
    this.chosenDefender = chosenDefender;
    this.shotgunSound = new Audio();
    this.shotgunSound.src = "./sounds/shotgun3.wav";
  }
  draw() {
    // ctx.fillStyle = "blue";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.fillStyle = "gold";
    // ctx.font = "30px Orbitron";
    // ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 30); // Display health
    if (this.chosenDefender === 1) {
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
    } else if (this.chosenDefender === 2) {
      ctx.drawImage(
        defender2,
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
    if (frame % defenderShotInterval === 0) {
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = this.minFrame;
      if (this.frameX === 22) this.shootNow = true;
    }
    // Synchronize shooting animation frames
    if (this.shooting) {
      this.minFrame = 20;
      this.maxFrame = 25;
    }
    // Synchronize idle frames
    else {
      this.minFrame = 0;
      this.maxFrame = 19;
    }
    // Make sure animation and projectile shoot at same time
    if (this.shooting && this.shootNow) {
      projectiles.push(new Projectile(this.x + 70, this.y + 40));
      this.shootNow = false;
      //sound.src = "./sounds/click5.ogg"; //play sound when defender shooting
      //sound2.play();
      this.shotgunSound.play();
    }
  }
}

const defender1 = new Image();
defender1.src = "./images/pink-spritesheet.png";
const defender2 = new Image();
defender2.src = "./images/purple-spritesheet.png";
const defender3 = new Image();
defender3.src = "./images/green-spritesheet.png";

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

const projectile = new Image();
projectile.src = "./images/projectile1.png";
// PROJECTILES
class Projectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.power = 20; // Projectile power. Normal 20, set to 400 to debug faster
    this.speed = 5;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 250;
    this.spriteHeight = 250;
    this.minFrame = 0;
    this.maxFrame = 3;
    //this.ouchSound = new Audio();
    //this.ouchSound.src = "./sounds/ouch.wav";
  }
  update() {
    this.x += this.speed;
    if (this.frameX < this.maxFrame) this.frameX++;
    else this.frameX = this.minFrame;
  }
  draw() {
    // ctx.fillStyle = "purple";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
    // ctx.fill();
    ctx.drawImage(
      projectile,
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
  ouch() {
    //this.ouchSound.play(); // Plays ouch sound when called
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
        // sound.src = "./sounds/ouch.wav"; //play sound when enemy gets shot
        // sound3.play(); //play sound when enemy gets shot
        //projectiles[i].ouch(); // Play sound when enemy gets shot
        enemies[j].health -= projectiles[i].power; //Health removed enemy
        projectiles.splice(i, 1);
        //enemies[j].shadowColor = "red";
        setTimeout(function () {
          //enemies[j].shadowColor = "green";
        }, 1000);
        i--;
      }
      if (frame % 200 === 0) {
        sound3.play();
      }
    }
    // Removes projectile when it exits canvas border
    if (projectiles[i] && projectiles[i].x > canvas.width - cellSize) {
      projectiles.splice(i, 1);
      i--;
    }
  }
}

class Shield {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.shooting = false; // Is there an enemy in my row?
    this.shootNow = false;
    this.health = 600;
    this.projectiles = []; // Projectiles I am currently shooting
    this.timer = 0; // Periodically trigger defender actions
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 150;
    this.spriteHeight = 150;
    this.minFrame = 0;
    this.maxFrame = 25;
    this.chosenDefender = chosenDefender;
  }
  draw() {
    // ctx.fillStyle = "blue";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.fillStyle = "gold";
    // ctx.font = "30px Orbitron";
    // ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 30); // Display health
    ctx.drawImage(
      defender3,
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
  update() {
    // Shooting speed
    if (frame % 2 === 0) {
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = this.minFrame;
      if (this.frameX === 10) this.shootNow = true;
    }
    // Synchronize shooting animation frames
    if (this.shooting) {
      this.minFrame = 20;
      this.maxFrame = 25;
    }
    // Synchronize idle frames
    else {
      this.minFrame = 0;
      this.maxFrame = 19;
    }
    // Make sure animation and projectile shoot at same time
    if (this.shooting && this.shootNow) {
      //projectiles.push(new Projectile(this.x + 70, this.y + 45));
      this.shootNow = false;
      // sound.src = "./sounds/laser-shot.wav"; //play sound when defender shooting
      //sound2.play();
    }
  }
}
