// Animation loop (basically a digital flipbook)
function animate() {
  //requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(levels[level].background, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
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
  if (!gameOver)requestAnimationFrame(animate)//Callback function calls itself to loop through itself
  
}

// Call animate function manually
function startGame() {
  console.log("startGame() function called!"); //debug
  //sound.src = "./sounds/gamesong.mp3";    //play the music while game is in progress
  sound1.play();  //play the music while game is in progress
  sound1.volume = 0.5;  //play the music while game is in progress
  if(gameOver); 
  animate();
}
test()

function test(){
    console.log("test")
}

