// src/entities/Player.js
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics body sizing - smaller than visual so collisions feel fair
    this.body.setSize(20, 22);
    this.body.setOffset(6, 6);
    this.setCollideWorldBounds(true);
    this.setDepth(10);

    this.speed = 160;
    this.isDead = false;

    // Input keys
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // Facing direction for visual flip
    this.facingRight = true;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.isDead) {
      this.body.setVelocity(0, 0);
      return;
    }

    const left = this.cursors.left.isDown || this.keyA.isDown;
    const right = this.cursors.right.isDown || this.keyD.isDown;
    const up = this.cursors.up.isDown || this.keyW.isDown;
    const down = this.cursors.down.isDown || this.keyS.isDown;

    let vx = 0;
    let vy = 0;

    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;

    // Normalize diagonal movement
    const len = Math.hypot(vx, vy);
    if (len > 0) {
      vx = (vx / len) * this.speed;
      vy = (vy / len) * this.speed;

      // Flip sprite based on horizontal direction
      if (vx < 0) {
        this.setFlipX(true);
        this.facingRight = false;
      } else if (vx > 0) {
        this.setFlipX(false);
        this.facingRight = true;
      }
    }

    this.body.setVelocity(vx, vy);
  }

  kill() {
    this.isDead = true;
    this.body.setVelocity(0, 0);
    this.setTint(0xff0000);
  }
}
