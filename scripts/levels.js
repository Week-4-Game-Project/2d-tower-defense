let backgroundImage = new Image();
backgroundImage.src = "./images/anotherbackground.png";

let backgroundImage2 = new Image();
backgroundImage2.src = "./images/newbackgroundimage.png";

let backgroundImage3 = new Image();
backgroundImage3.src = "./images/background3.png";

const levels = [
  {
    name: "level 1",
    background: backgroundImage,
    winningScore: 250,
  },
  {
    name: "level 2",
    background: backgroundImage2,
    winningScore: 1000,
  },
  {
    name: "level 3",
    background: backgroundImage3,
    winningScore: 2000,
  },
];

let level = 0;

const button = document.getElementById("play-again"); // ADDED
// button.style.visibility = "visible";
button.addEventListener("click", () => {
  // console.log("button", button);
  // button.style.visibility = "hidden";
  window.location.reload();
  // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
});

document.getElementById("start-button").onclick = () => {
  console.log("Start button clicked!");
  document.getElementById("intro").style.visibility = "hidden";
  button.style.visibility = "hidden";
  // sound.src = "./sounds/test.wav";
  // sound.play();
  console.log(sound);
  startGame();
};

window.addEventListener("resize", function () {
  canvasPosition = canvas.getBoundingClientRect();
});

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
