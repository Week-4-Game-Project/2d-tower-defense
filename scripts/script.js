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
const card3 = {
  x: 170,
  y: 10,
  width: 70,
  height: 85,
};

// DEFENDER CHOICE CARDS
function chooseDefender() {
  let card1stroke = "black";
  let card2stroke = "black";
  let card3stroke = "black";
  if (collision(mouse, card1) && mouse.clicked) {
    chosenDefender = 1;
  } else if (collision(mouse, card2) && mouse.clicked) {
    chosenDefender = 2;
  } else if (collision(mouse, card3) && mouse.clicked) {
    chosenDefender = 3;
  }
  if (chosenDefender === 1) {
    card1stroke = "gold";
    card2stroke = "black";
    card3stroke = "black";
  } else if (chosenDefender === 2) {
    card1stroke = "black";
    card2stroke = "gold";
    card3stroke = "black";
  } else if (chosenDefender === 3) {
    card1stroke = "black";
    card2stroke = "black";
    card3stroke = "gold";
  } else {
    card1stroke = "black";
    card2stroke = "black";
    card3stroke = "black";
  }

  ctx.lineWidth = 1;
  ctx.fillStyle = "rgba(0, 0, 0,0.8)";
  ctx.fillRect(card1.x, card1.y, card1.width, card1.height);
  ctx.strokeStyle = card1stroke;
  ctx.strokeRect(card1.x, card1.y, card1.width, card1.height);
  ctx.drawImage(defender1, 0, 0, 130, 130, 15, 15, 130 / 2, 130 / 2);
  // Defender 2 card draw
  ctx.fillRect(card2.x, card2.y, card2.width, card2.height);
  ctx.strokeStyle = card2stroke;
  ctx.strokeRect(card2.x, card2.y, card2.width, card2.height);
  ctx.drawImage(defender2, 0, 0, 130, 130, 95, 15, 130 / 2, 130 / 2);
  // Defender 3 card draw
  ctx.fillRect(card3.x, card3.y, card3.width, card3.height);
  ctx.strokeStyle = card3stroke;
  ctx.strokeRect(card3.x, card3.y, card3.width, card3.height);
  ctx.drawImage(defender3, 0, 0, 130, 130, 175, 15, 130 / 2, 130 / 2);
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

// UTILITIES
// Draw game status on game bar (resources, defenders, etc)
function handleGameStatus() {
  fillStyle = "gold";
  ctx.font = "30px Orbitron";
  ctx.fillText("Score: " + score, 260, 40);
  ctx.fillText("Resources: " + numberOfResources, 260, 80);

  // Game won
  if (
    score >= levels[level].winningScore &&
    enemies.length === 0 &&
    level == 2
  ) {
    ctx.fillStyle = "black";
    ctx.font = "60px Orbitron";
    ctx.fillText("GAME COMPLETE", 130, 320);
    ctx.font = "30px Orbitron";
    ctx.fillText("You win with " + score + " points!", 134, 370);
    // const button = document.getElementById("play-again"); // ADDED
    button.style.visibility = "visible";
    // button.addEventListener("click", () => {
    //   console.log("button", button);
    //   button.style.visibility = "hidden";
    //   window.location.reload();
    //   ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // });
    // Next level
  } else if (
    score >= levels[level].winningScore &&
    enemies.length === 0 &&
    nextLevel
  ) {
    nextLevel = false;
    level++;
    setTimeout(function () {
      winningScore = levels[level].winningScore;
      nextLevel = true;
      //defenders = [];
    }, 3000);
  }
  // Game over
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "90px Orbitron";
    ctx.fillText("GAME OVER", 135, 320);
    sound.src = "./sounds/funnySong.mp3";
    sound.play();
    // const button = document.getElementById("play-again"); // Play again button
    button.style.visibility = "visible";
    // button.addEventListener("click", () => {
    //   console.log("button", button);
    //   button.style.visibility = "hidden";
    //   window.location.reload();
    //   ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // });
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
    if (chosenDefender === 1 || chosenDefender === 2) {
      defenders.push(new Defender(gridPositionX, gridPositionY)); // If resources > cost, place defender at mouse location
      numberOfResources -= defenderCost; // Pay resources
    } else if (chosenDefender === 3) {
      console.log("summon shield");
      defenders.push(new Shield(gridPositionX, gridPositionY)); // If resources > cost, place defender at mouse location
      numberOfResources -= defenderCost; // Pay resources
    }
  } else {
    floatingMessages.push(
      new floatingMessage("need more resources", mouse.x, mouse.y, 20, "blue")
    );
  }
});