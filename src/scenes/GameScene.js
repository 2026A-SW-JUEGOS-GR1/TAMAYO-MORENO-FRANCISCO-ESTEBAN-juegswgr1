// src/scenes/GameScene.js
import MapBuilder from '../utils/MapBuilder.js';
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import AudioManager from '../utils/AudioManager.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
    // Reset state each time the scene starts
    this.score = 0;
    this.timeLeft = 90;
    this.artifactsRemaining = 0;
    this.timerEvent = null;
    this.gameOver = false;
  }

  create() {
    const { width, height } = this.scale;

    // Build map data
    const mapData = MapBuilder.getMap();
    const rows = mapData.length;
    const cols = mapData[0].length;
    const tileSize = 64;

    // Set world bounds
    this.physics.world.setBounds(0, 0, cols * tileSize, rows * tileSize);

    // Background
    this.cameras.main.setBackgroundColor('#1a1209');

    // Create groups
    this.wallGroup = this.physics.add.staticGroup();
    this.artifactGroup = this.physics.add.staticGroup();
    this.exitGroup = this.physics.add.staticGroup();
    this.enemyGroup = this.physics.add.group({
      allowGravity: false,
    });

    // Populate tiles
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tile = mapData[y][x];
        const worldX = x * tileSize + tileSize / 2;
        const worldY = y * tileSize + tileSize / 2;

        // Place floor everywhere that is not a wall
        if (tile !== 1) {
          this.add.image(worldX, worldY, 'floor').setDepth(0);
        }

        switch (tile) {
          case 1: { // wall
            const wall = this.wallGroup.create(worldX, worldY, 'wall');
            wall.setDepth(1);
            // Ensure wall body matches tile perfectly
            wall.body.setSize(tileSize, tileSize);
            wall.body.setOffset(0, 0);
            wall.refreshBody();
            break;
          }
          case 2: { // artifact
            const artifact = this.artifactGroup.create(worldX, worldY, 'artifact');
            artifact.setDepth(5);
            // Smaller collision body for artifact pickup
            artifact.body.setSize(32, 32);
            artifact.body.setOffset(16, 16);
            artifact.refreshBody();
            this.artifactsRemaining++;

            // Floating animation
            this.tweens.add({
              targets: artifact,
              y: worldY - 4,
              duration: 800,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut',
            });
            break;
          }
          case 3: { // exit
            const exit = this.exitGroup.create(worldX, worldY, 'exit');
            exit.setDepth(2);
            exit.body.setSize(40, 40);
            exit.body.setOffset(12, 12);
            exit.refreshBody();

            // Pulsing glow effect
            this.tweens.add({
              targets: exit,
              alpha: 0.6,
              duration: 1000,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut',
            });
            break;
          }
          case 4: { // player start
            this.player = new Player(this, worldX, worldY);
            break;
          }
          case 5: { // enemy
            const enemy = new Enemy(this, worldX, worldY);
            this.enemyGroup.add(enemy);
            break;
          }
        }
      }
    }

    // ---- COLLISIONS ----
    // Player vs walls
    this.physics.add.collider(this.player, this.wallGroup);

    // Enemies vs walls (so they don't walk through)
    this.physics.add.collider(this.enemyGroup, this.wallGroup);

    // Player picks up artifacts
    this.physics.add.overlap(
      this.player, this.artifactGroup,
      this.collectArtifact, null, this
    );

    // Player touches enemy = death
    this.physics.add.overlap(
      this.player, this.enemyGroup,
      this.handlePlayerDeath, null, this
    );

    // Player reaches exit
    this.physics.add.overlap(
      this.player, this.exitGroup,
      this.checkVictory, null, this
    );

    // Camera follows player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, cols * tileSize, rows * tileSize);
    this.cameras.main.setZoom(1);

    // ---- HUD ----
    // Semi-transparent HUD background
    const hudBg = this.add.rectangle(width / 2, 22, width, 44, 0x000000, 0.5);
    hudBg.setScrollFactor(0).setDepth(100);

    this.scoreText = this.add.text(16, 10, 'Score: 0', {
      fontFamily: '"Courier New", monospace',
      fontSize: '20px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setScrollFactor(0).setDepth(101);

    this.timerText = this.add.text(width - 16, 10, `Time: ${this.timeLeft}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '20px',
      color: '#FF6B6B',
      fontStyle: 'bold',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(101);

    this.artifactText = this.add.text(width / 2, 10, `Idols: ${this.artifactsRemaining}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '20px',
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(101);

    // Hint text
    if (this.artifactsRemaining > 0) {
      this.hintText = this.add.text(width / 2, height - 30,
        '🗿 Collect all golden idols, then find the exit!', {
          fontFamily: '"Courier New", monospace',
          fontSize: '14px',
          color: '#AAAAAA',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

      // Fade out hint after 4 seconds
      this.time.delayedCall(4000, () => {
        if (this.hintText) {
          this.tweens.add({
            targets: this.hintText,
            alpha: 0,
            duration: 1000,
          });
        }
      });
    }

    // Timer event
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    // Fog / vignette overlay for atmosphere
    const vignette = this.add.graphics().setScrollFactor(0).setDepth(99);
    vignette.fillStyle(0x000000, 0.2);
    vignette.fillRect(0, 0, width, 50);
    vignette.fillStyle(0x000000, 0.15);
    vignette.fillRect(0, height - 30, width, 30);
  }

  update(time, delta) {
    // Nothing needed here; movement handled in preUpdate of Player/Enemy
  }

  collectArtifact(player, artifact) {
    if (this.gameOver) return;

    artifact.destroy();
    this.score += 100;
    this.artifactsRemaining--;
    this.scoreText.setText('Score: ' + this.score);
    this.artifactText.setText('Idols: ' + this.artifactsRemaining);

    AudioManager.play('pickup');

    // Flash pickup effect
    this.cameras.main.flash(200, 255, 215, 0, false, null, this);

    if (this.artifactsRemaining === 0) {
      this.artifactText.setText('✓ Find the exit!');
      this.artifactText.setColor('#00FF88');
    }
  }

  handlePlayerDeath(player, enemy) {
    if (this.gameOver) return;
    this.gameOver = true;

    player.kill();

    // Camera shake on death
    this.cameras.main.shake(300, 0.02);

    this.time.delayedCall(800, () => {
      this.scene.start('GameOverScene', { reason: 'enemy', score: this.score });
    });
  }

  checkVictory(player, exit) {
    if (this.gameOver) return;

    if (this.artifactsRemaining <= 0) {
      this.gameOver = true;
      this.cameras.main.flash(500, 255, 255, 255);
      this.time.delayedCall(600, () => {
        this.scene.start('VictoryScene', { score: this.score, timeLeft: this.timeLeft });
      });
    }
  }

  updateTimer() {
    if (this.gameOver) return;

    this.timeLeft--;
    this.timerText.setText('Time: ' + this.timeLeft);

    // Warning flash when time is low
    if (this.timeLeft <= 10) {
      this.timerText.setColor('#FF0000');
      this.tweens.add({
        targets: this.timerText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 200,
        yoyo: true,
      });
    }

    if (this.timeLeft <= 0) {
      this.gameOver = true;
      if (this.timerEvent) this.timerEvent.remove(false);
      this.scene.start('GameOverScene', { reason: 'time', score: this.score });
    }
  }
}
