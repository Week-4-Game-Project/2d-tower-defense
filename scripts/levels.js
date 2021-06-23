let backgroundImage = new Image();
backgroundImage.src = "./images/alien-planet-sand.png";

let backgroundImage2 = new Image();
backgroundImage2.src = "./images/background2.png";

let backgroundImage3 = new Image();
backgroundImage3.src = "./images/background3.png";

const levels = [
  {
    name: "level 1",
    background: backgroundImage,
    winningScore: 10,
  },
  {
    name: "level 2",
    background: backgroundImage2,
    winningScore: 50,
  },
  {
    name: "level 3",
    background: backgroundImage3,
    winningScore: 100,
  },
];

let level = 0;
