// class Shield extends Defender {
//   constructor(x, y) {
//     super(x, y);
//   }
//   draw() {
//     // ctx.fillStyle = "blue";
//     // ctx.fillRect(this.x, this.y, this.width, this.height);
//     // ctx.fillStyle = "gold";
//     // ctx.font = "30px Orbitron";
//     // ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 30); // Display health
//     ctx.drawImage(
//       defender3,
//       this.frameX * this.spriteWidth,
//       0,
//       this.spriteWidth,
//       this.spriteHeight,
//       this.x,
//       this.y,
//       this.width,
//       this.height
//     );
//   }
//   update() {
//     // Shooting speed
//     if (frame % 14 === 0) {
//       if (this.frameX < this.maxFrame) this.frameX++;
//       else this.frameX = this.minFrame;
//       if (this.frameX === 10) this.shootNow = true;
//     }
//     // Synchronize shooting animation frames
//     if (this.shooting) {
//       this.minFrame = 0;
//       this.maxFrame = 11;
//     }
//     // Synchronize idle frames
//     else {
//       this.minFrame = 12;
//       this.maxFrame = 23;
//     }
//     // Make sure animation and projectile shoot at same time
//     if (this.shooting && this.shootNow) {
//       projectiles.push(new Projectile(this.x + 70, this.y + 45));
//       this.shootNow = false;
//       sound.src = "./sounds/laser-shot.wav"; //play sound when defender shooting
//       sound.play();
//     }
//   }
// }
