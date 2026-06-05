// src/entities/Enemy.js
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics body - slightly smaller for fair collision
    this.body.setSize(22, 22);
    this.body.setOffset(5, 5);
    this.setCollideWorldBounds(true);
    this.setDepth(9);

    this.speed = 70;
    this.body.setImmovable(true);

    // Patrol state
    this.patrolDir = Phaser.Math.Between(0, 3); // 0=right, 1=down, 2=left, 3=up
    this.patrolTimer = 0;
    this.patrolDuration = Phaser.Math.Between(1000, 2500);

    this.applyPatrolVelocity();
  }

  applyPatrolVelocity() {
    switch (this.patrolDir) {
      case 0: this.body.setVelocity(this.speed, 0); break;
      case 1: this.body.setVelocity(0, this.speed); break;
      case 2: this.body.setVelocity(-this.speed, 0); break;
      case 3: this.body.setVelocity(0, -this.speed); break;
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.patrolTimer += delta;

    // Change direction on timer or when hitting wall (velocity becomes 0)
    const blocked = this.body.blocked;
    const hitWall = blocked.left || blocked.right || blocked.up || blocked.down;

    if (this.patrolTimer >= this.patrolDuration || hitWall) {
      this.patrolTimer = 0;
      this.patrolDuration = Phaser.Math.Between(1000, 2500);

      if (hitWall) {
        // Turn around or pick a perpendicular direction
        const options = [];
        if (!blocked.right) options.push(0);
        if (!blocked.down) options.push(1);
        if (!blocked.left) options.push(2);
        if (!blocked.up) options.push(3);

        if (options.length > 0) {
          this.patrolDir = options[Phaser.Math.Between(0, options.length - 1)];
        } else {
          this.patrolDir = (this.patrolDir + 2) % 4; // reverse
        }
      } else {
        this.patrolDir = Phaser.Math.Between(0, 3);
      }

      this.applyPatrolVelocity();
    }

    // Flip sprite based on direction
    if (this.body.velocity.x < 0) this.setFlipX(true);
    else if (this.body.velocity.x > 0) this.setFlipX(false);
  }
}
