const canvas = document.getElementById("canvas"); //Connects this file to the index.html <canvas> element
const ctx = canvas.getContext("2d"); //Calls canvas 2d context methods
canvas.width = 900;
canvas.height = 600;

// GLOBAL VARIABLES
const cellSize = 100; // Size of each game board cell
const cellGap = 3; // Gap between cells
let numberOfResources = 300;
let enemiesInterval = 200; // Enemy spawn interval
let frame = 0;
let gameOver = false;
let score = 0;
let winningScore = 250; //must be level 1 winning score
let chosenDefender = 1;
let sound = document.createElement("audio"); //adding sound
let sound1 = new Audio();
let sound2 = new Audio();
let sound3 = new Audio();
sound1.src = "./sounds/gamesong.mp3";
sound1.loop = true;
sound2.src = "./sounds/shotgun3.wav";
sound3.src = "./sounds/ouch.wav";
let nextLevel = true;
let lastLevel = false;

const gameGrid = []; // Array of game cells
let defenders = []; // Array of defenders on game board
const enemies = [];
const enemyPositions = [];
const projectiles = [];
const resources = [];

// Debugging cheats
let defenderShotInterval = 8; // Frequency of defender attack. Lower # means faster shooting
let resourceFrequency = 500; // Frequency of resource spawn. Lower # means faster spawn
// For more shooting power, edit this.power on Projectile class

// mouse
const mouse = {
  x: 10,
  y: 10,
  width: 0.1,
  height: 0.1,
  clicked: false,
};

canvas.addEventListener("mousedown", function () {
  mouse.clicked = true;
});
canvas.addEventListener("mouseup", function () {
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
